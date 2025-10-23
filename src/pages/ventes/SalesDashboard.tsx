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
  FileTextOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useSales } from '../../hooks/ventes/useSales';
import { SaleQuote, SaleOrder, SalesFilter } from '../../types';
import SalesStatsCards from '../../components/ventes/SalesStatsCards';
import SalesQuotesTable from '../../components/ventes/SalesQuotesTable';
import SalesOrdersTable from '../../components/ventes/SalesOrdersTable';

const { Option } = Select;
const { TabPane } = Tabs;

const SalesDashboard: React.FC = () => {
  const {
    quotes,
    orders,
    loading,
    error,
    stats,
    createQuote,
    updateQuote,
    convertQuoteToOrder,
    createOrder,
    updateOrder,
    updateOrderStatus,
    searchSales,
    exportSales
  } = useSales();

  const [filters, setFilters] = useState<SalesFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'quotes' | 'orders'>('quotes');

  // Filtrage des données
  const filteredData = searchSales({
    ...filters,
    searchTerm: searchTerm || undefined
  });

  const handleCreateQuote = () => {
    message.info('Création de devis - À implémenter');
  };

  const handleCreateOrder = () => {
    message.info('Création de commande - À implémenter');
  };

  const handleEditQuote = (quote: SaleQuote) => {
    message.info(`Modifier devis: ${quote.quoteNumber}`);
  };

  const handleEditOrder = (order: SaleOrder) => {
    message.info(`Modifier commande: ${order.orderNumber}`);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      // Implémentation de la suppression
      message.success('Devis supprimé avec succès');
    } catch (err) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      // Implémentation de la suppression
      message.success('Commande supprimée avec succès');
    } catch (err) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleViewQuote = (quote: SaleQuote) => {
    message.info(`Voir devis: ${quote.quoteNumber}`);
  };

  const handleViewOrder = (order: SaleOrder) => {
    message.info(`Voir commande: ${order.orderNumber}`);
  };

  const handleConvertQuote = async (quoteId: string) => {
    try {
      await convertQuoteToOrder(quoteId);
      message.success('Devis converti en commande avec succès');
    } catch (err) {
      message.error('Erreur lors de la conversion');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    try {
      await updateOrderStatus(orderId, status);
      message.success('Statut mis à jour avec succès');
    } catch (err) {
      message.error('Erreur lors de la mise à jour');
    }
  };

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'quotes':
        setActiveTab('quotes');
        break;
      case 'orders':
        setActiveTab('orders');
        break;
      case 'pending':
        setFilters(prev => ({ ...prev, status: 'EN_ATTENTE' }));
        setActiveTab('orders');
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    exportSales(filters);
    message.success('Export en cours...');
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sales-dashboard"
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
              <ShoppingCartOutlined style={{ color: '#1890ff', fontSize: '28px' }} />
              Ventes
            </h1>
            <p style={{ margin: 0, color: '#666', marginTop: 8 }}>
              Gestion des devis et commandes clients
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
                onClick={activeTab === 'quotes' ? handleCreateQuote : handleCreateOrder}
                size="large"
              >
                Nouveau {activeTab === 'quotes' ? 'Devis' : 'Commande'}
              </Button>
            </Space>
          </Col>
        </Row>
      </motion.div>

      {/* Cartes de statistiques */}
      <SalesStatsCards 
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
                placeholder="Rechercher par numéro, client..."
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
                  placeholder="Statut"
                  value={filters.status}
                  onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  style={{ width: 150 }}
                  allowClear
                >
                  {activeTab === 'quotes' ? (
                    <>
                      <Option value="BROUILLON">Brouillon</Option>
                      <Option value="ENVOYE">Envoyé</Option>
                      <Option value="ACCEPTE">Accepté</Option>
                      <Option value="REFUSE">Refusé</Option>
                      <Option value="EXPIRE">Expiré</Option>
                    </>
                  ) : (
                    <>
                      <Option value="BROUILLON">Brouillon</Option>
                      <Option value="EN_ATTENTE">En attente</Option>
                      <Option value="CONFIRME">Confirmé</Option>
                      <Option value="LIVRE">Livré</Option>
                      <Option value="FACTURE">Facturé</Option>
                    </>
                  )}
                </Select>

                {(filters.status) && (
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

      {/* Tableaux avec onglets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'quotes' | 'orders')}
            tabBarExtraContent={
              <Space>
                <Tag color="blue">
                  {activeTab === 'quotes' 
                    ? `${filteredData.quotes.length} devis trouvé(s)`
                    : `${filteredData.orders.length} commande(s) trouvée(s)`
                  }
                </Tag>
              </Space>
            }
          >
            <TabPane 
              tab={
                <span>
                  <FileTextOutlined />
                  Devis ({quotes.length})
                </span>
              } 
              key="quotes"
            >
              <SalesQuotesTable
                quotes={filteredData.quotes}
                loading={loading}
                onEdit={handleEditQuote}
                onDelete={handleDeleteQuote}
                onView={handleViewQuote}
                onConvert={handleConvertQuote}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <ShoppingCartOutlined />
                  Commandes ({orders.length})
                </span>
              } 
              key="orders"
            >
              <SalesOrdersTable
                orders={filteredData.orders}
                loading={loading}
                onEdit={handleEditOrder}
                onDelete={handleDeleteOrder}
                onView={handleViewOrder}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            </TabPane>
          </Tabs>
        </Card>
      </motion.div>

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
          <ShoppingCartOutlined />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SalesDashboard;