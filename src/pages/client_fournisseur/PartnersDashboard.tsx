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
//   FilterOutlined,
  ExportOutlined,
  TeamOutlined,
  UserOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { usePartners } from '../../hooks/clients_fournisseurs/usePartners';
import { BusinessPartner, BusinessPartnerType, PartnerFilter } from '../../types';
import PartnerStatsCards from '../../components/partners/PartnerStatsCards';
import PartnersTable from '../../components/partners/PartnersTable';
import PartnerForm from '../../components/partners/PartnerForm';

const { Option } = Select;
const { TabPane } = Tabs;

const PartnersDashboard: React.FC = () => {
  const {
    partners,
    loading,
    error,
    stats,
    createPartner,
    updatePartner,
    deletePartner,
    searchPartners,
    exportPartners
  } = usePartners();

  const [filters, setFilters] = useState<PartnerFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPartner, setEditingPartner] = useState<BusinessPartner | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | BusinessPartnerType>('all');

  // Filtrage des partenaires
  const filteredPartners = searchPartners({
    ...filters,
    type: activeTab === 'all' ? undefined : activeTab,
    searchTerm: searchTerm || undefined
  });

  const handleCreatePartner = () => {
    setEditingPartner(null);
    setIsModalVisible(true);
  };

  const handleEditPartner = (partner: BusinessPartner) => {
    setEditingPartner(partner);
    setIsModalVisible(true);
  };

  const handleDeletePartner = async (partnerId: string) => {
    try {
      await deletePartner(partnerId);
      message.success('Partenaire supprimé avec succès');
    } catch (err) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleViewPartner = (partner: BusinessPartner) => {
    // Navigation vers la page détail (à implémenter)
    message.info(`Voir détails: ${partner.name}`);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingPartner) {
        await updatePartner(editingPartner.id, values);
        message.success('Partenaire modifié avec succès');
      } else {
        await createPartner(values);
        message.success('Partenaire créé avec succès');
      }
      setIsModalVisible(false);
      setEditingPartner(null);
    } catch (err) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'clients':
        setActiveTab('CLIENT');
        break;
      case 'fournisseurs':
        setActiveTab('FOURNISSEUR');
        break;
      case 'retards':
        setFilters(prev => ({ ...prev, riskLevel: 'ELEVE' }));
        break;
      case 'risque':
        setFilters(prev => ({ ...prev, riskLevel: 'ELEVE' }));
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    exportPartners(filters);
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
      className="partners-dashboard"
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
              <TeamOutlined style={{ color: '#1890ff', fontSize: '28px' }} />
              Clients & Fournisseurs
            </h1>
            <p style={{ margin: 0, color: '#666', marginTop: 8 }}>
              Gestion des partenaires commerciaux
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
                onClick={handleCreatePartner}
                size="large"
              >
                Nouveau Partenaire
              </Button>
            </Space>
          </Col>
        </Row>
      </motion.div>

      {/* Cartes de statistiques */}
      <PartnerStatsCards 
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
                placeholder="Rechercher par nom, NIU, ville..."
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
                  value={filters.category}
                  onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                  style={{ width: 150 }}
                  allowClear
                >
                  <Option value="STANDARD">Standard</Option>
                  <Option value="VIP">VIP</Option>
                  <Option value="STRATEGIQUE">Stratégique</Option>
                  <Option value="RISQUE">Risque</Option>
                </Select>

                <Select
                  placeholder="Niveau risque"
                  value={filters.riskLevel}
                  onChange={(value) => setFilters(prev => ({ ...prev, riskLevel: value }))}
                  style={{ width: 150 }}
                  allowClear
                >
                  <Option value="FAIBLE">Faible</Option>
                  <Option value="MOYEN">Moyen</Option>
                  <Option value="ELEVE">Élevé</Option>
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

                {(filters.category || filters.riskLevel || filters.isActive) && (
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
                  {filteredPartners.length} partenaire(s) trouvé(s)
                </Tag>
              </Space>
            }
          >
            <TabPane 
              tab={
                <span>
                  <TeamOutlined />
                  Tous les partenaires
                </span>
              } 
              key="all"
            />

            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  Clients ({partners.filter(p => p.type === 'CLIENT').length})
                </span>
              } 
              key="CLIENT"
            />

            <TabPane 
              tab={
                <span>
                  <ShopOutlined />
                  Fournisseurs ({partners.filter(p => p.type === 'FOURNISSEUR').length})
                </span>
              } 
              key="FOURNISSEUR"
            />
          </Tabs>

          <PartnersTable
            partners={filteredPartners}
            loading={loading}
            onEdit={handleEditPartner}
            onDelete={handleDeletePartner}
            onView={handleViewPartner}
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
                {editingPartner ? 'Modifier le partenaire' : 'Nouveau partenaire'}
              </motion.span>
            }
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingPartner(null);
            }}
            footer={null}
            width={800}
            style={{ top: 20 }}
          >
            <PartnerForm
              partner={editingPartner || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsModalVisible(false);
                setEditingPartner(null);
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
          <TeamOutlined />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PartnersDashboard;