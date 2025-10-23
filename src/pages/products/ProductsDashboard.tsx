import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Space,
  Modal,
  Tabs,
  message,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ExportOutlined,
  BoxPlotOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  BankOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../hooks/products/useProducts';
import { Product, ProductType, ProductFilter } from '../../types';
import ProductStatsCards from '../../components/products/ProductStatsCards';
import ProductsTable from '../../components/products/ProductsTable';
import ProductForm from '../../components/products/ProductForm';

const { Option } = Select;
const { TabPane } = Tabs;

const ProductsDashboard: React.FC = () => {
  const {
    products,
    categories,
    loading,
    error,
    stats,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    exportProducts
  } = useProducts();

  const [filters, setFilters] = useState<ProductFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | ProductType>('all');

  // Filtrage des produits
  const filteredProducts = searchProducts({
    ...filters,
    type: activeTab === 'all' ? undefined : activeTab,
    searchTerm: searchTerm || undefined
  });

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      message.success('Produit supprimé avec succès');
    } catch (err) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleViewProduct = (product: Product) => {
    // Navigation vers la page détail (à implémenter)
    message.info(`Voir détails: ${product.name}`);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        message.success('Produit modifié avec succès');
      } else {
        await createProduct(values);
        message.success('Produit créé avec succès');
      }
      setIsModalVisible(false);
      setEditingProduct(null);
    } catch (err) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'out-of-stock':
        setFilters(prev => ({ ...prev, stockStatus: 'OUT_OF_STOCK' }));
        break;
      case 'low-stock':
        setFilters(prev => ({ ...prev, stockStatus: 'LOW_STOCK' }));
        break;
      case 'categories':
        // Pourrait ouvrir un modal de gestion des catégories
        message.info('Gestion des catégories');
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    exportProducts(filters);
    message.success('Export en cours...');
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getTypeIcon = (type: ProductType) => {
    switch (type) {
      case 'PRODUIT': return <BoxPlotOutlined />;
      case 'SERVICE': return <ToolOutlined />;
      case 'MATIERE': return <ThunderboltOutlined />;
      case 'IMMOBILISATION': return <BankOutlined />;
      default: return <BoxPlotOutlined />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="products-dashboard"
    >
      {/* En-tête */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <BoxPlotOutlined style={{ color: '#1890ff', fontSize: '28px' }} />
              Produits & Tarification
            </h1>
            <p style={{ margin: 0, color: '#666', marginTop: 8 }}>
              Gestion du catalogue produits et de la tarification
            </p>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                Exporter
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateProduct}
                size="large"
              >
                Nouveau Produit
              </Button>
            </Space>
          </Col>
        </Row>
      </motion.div>

      {/* Cartes de statistiques */}
      <ProductStatsCards 
        stats={stats} 
        onStatClick={handleStatClick}
      />

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Input
                placeholder="Rechercher par nom, code, référence..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
                style={{ maxWidth: 400 }}
              />
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder="Catégorie"
                  value={filters.categoryId}
                  onChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}
                  style={{ width: 180 }}
                  allowClear
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Statut stock"
                  value={filters.stockStatus}
                  onChange={(value) => setFilters(prev => ({ ...prev, stockStatus: value }))}
                  style={{ width: 150 }}
                  allowClear
                >
                  <Option value="IN_STOCK">En stock</Option>
                  <Option value="LOW_STOCK">Stock faible</Option>
                  <Option value="OUT_OF_STOCK">Rupture</Option>
                </Select>

                <Select
                  placeholder="Statut"
                  value={filters.isActive}
                  onChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}
                  style={{ width: 120 }}
                  allowClear
                >
                  <Option value={true}>Actif</Option>
                  <Option value={false}>Inactif</Option>
                </Select>

                {(filters.categoryId || filters.stockStatus || filters.isActive) && (
                  <Button 
                    onClick={clearFilters}
                    type="text"
                  >
                    Tout effacer
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Tableau avec onglets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as any)}
            tabBarExtraContent={
              <Space>
                <Tag color="blue">
                  {filteredProducts.length} produit(s) trouvé(s)
                </Tag>
              </Space>
            }
          >
            <TabPane 
              tab={
                <span>
                  <BoxPlotOutlined />
                  Tous les produits
                </span>
              } 
              key="all"
            />

            <TabPane 
              tab={
                <span>
                  <BoxPlotOutlined />
                  Produits ({products.filter(p => p.type === 'PRODUIT').length})
                </span>
              } 
              key="PRODUIT"
            />

            <TabPane 
              tab={
                <span>
                  <ToolOutlined />
                  Services ({products.filter(p => p.type === 'SERVICE').length})
                </span>
              } 
              key="SERVICE"
            />

            <TabPane 
              tab={
                <span>
                  <ThunderboltOutlined />
                  Matières ({products.filter(p => p.type === 'MATIERE').length})
                </span>
              } 
              key="MATIERE"
            />

            <TabPane 
              tab={
                <span>
                  <BankOutlined />
                  Immobilisations ({products.filter(p => p.type === 'IMMOBILISATION').length})
                </span>
              } 
              key="IMMOBILISATION"
            />
          </Tabs>

          <ProductsTable
            products={filteredProducts}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onView={handleViewProduct}
          />
        </Card>
      </motion.div>

      {/* Modal de création/édition */}
      <AnimatePresence>
        {isModalVisible && (
          <Modal
            title={
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </motion.span>
            }
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingProduct(null);
            }}
            footer={null}
            width={900}
            style={{ top: 20 }}
          >
            <ProductForm
              product={editingProduct || undefined}
              categories={categories}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsModalVisible(false);
                setEditingProduct(null);
              }}
              loading={loading}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Élément décoratif */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '300px',
            zIndex: -1,
            color: '#f0f2f5'
          }}
        >
          <BoxPlotOutlined />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsDashboard;