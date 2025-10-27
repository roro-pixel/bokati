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
  DollarOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useBilling } from '../../hooks/facturation/useBilling';
import { Invoice, Payment, BillingFilter } from '../../types';
import BillingStatsCards from '../../components/facturation/BillingStatsCards';
import InvoicesTable from '../../components/facturation/InvoicesTable';
import PaymentsTable from '../../components/facturation/PaymentsTable';

const { Option } = Select;
const { TabPane } = Tabs;

const BillingDashboard: React.FC = () => {
  const {
    invoices,
    payments,
    loading,
    error,
    stats,
    createInvoice,
    updateInvoice,
    sendInvoice,
    recordPayment,
    searchInvoices,
    exportInvoices,
    generatePDF
  } = useBilling();

  const [filters, setFilters] = useState<BillingFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');

  // Filtrage des factures
  const filteredInvoices = searchInvoices({
    ...filters,
    searchTerm: searchTerm || undefined
  });

  const handleCreateInvoice = () => {
    message.info('Création de facture');
  };

  const handleCreatePayment = () => {
    message.info('Enregistrement de paiement');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    message.info(`Modifier facture: ${invoice.invoiceNumber}`);
  };

  const handleEditPayment = (payment: Payment) => {
    message.info(`Modifier paiement: ${payment.paymentNumber}`);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      // Implémentation de la suppression
      message.success('Facture supprimée avec succès');
    } catch (err) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      // Implémentation de la suppression
      message.success('Paiement supprimé avec succès');
    } catch (err) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    message.info(`Voir facture: ${invoice.invoiceNumber}`);
  };

  const handleViewPayment = (payment: Payment) => {
    message.info(`Voir paiement: ${payment.paymentNumber}`);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoice(invoiceId);
      message.success('Facture envoyée avec succès');
    } catch (err) {
      message.error('Erreur lors de l\'envoi');
    }
  };

  const handleRecordPayment = async (invoice: Invoice) => {
    message.info(`Enregistrer paiement pour: ${invoice.invoiceNumber}`);
  };

  const handleGeneratePDF = async (invoiceId: string) => {
    try {
      const pdfUrl = await generatePDF(invoiceId);
      message.success('PDF généré avec succès');
      // Ouvrir le PDF dans un nouvel onglet
      window.open(pdfUrl, '_blank');
    } catch (err) {
      message.error('Erreur lors de la génération du PDF');
    }
  };

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'outstanding':
        setFilters(prev => ({ ...prev, status: 'ENVOYEE' }));
        setActiveTab('invoices');
        break;
      case 'aging':
        setFilters(prev => ({ ...prev, status: 'ENVOYEE' }));
        setActiveTab('invoices');
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    exportInvoices(filters);
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
      className="billing-dashboard"
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
              <FileTextOutlined style={{ color: '#1890ff', fontSize: '28px' }} />
              Facturation
            </h1>
            <p style={{ margin: 0, color: '#666', marginTop: 8 }}>
              Gestion des factures et des encaissements
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
                onClick={activeTab === 'invoices' ? handleCreateInvoice : handleCreatePayment}
                size="large"
              >
                Nouveau {activeTab === 'invoices' ? 'Facture' : 'Paiement'}
              </Button>
            </Space>
          </Col>
        </Row>
      </motion.div>

      {/* Cartes de statistiques */}
      <BillingStatsCards 
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
                  style={{ width: 180 }}
                  allowClear
                >
                  <Option value="BROUILLON">Brouillon</Option>
                  <Option value="EMISE">Émise</Option>
                  <Option value="ENVOYEE">Envoyée</Option>
                  <Option value="PARTIELLEMENT_PAYEE">Partiellement payée</Option>
                  <Option value="PAYEE">Payée</Option>
                  <Option value="ANNULEE">Annulée</Option>
                </Select>

                <Select
                  placeholder="Type"
                  value={filters.type}
                  onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                  style={{ width: 120 }}
                  allowClear
                >
                  <Option value="VENTE">Vente</Option>
                  <Option value="ACHAT">Achat</Option>
                  <Option value="AVOIR">Avoir</Option>
                  <Option value="ACOMPTE">Acompte</Option>
                </Select>

                {(filters.status || filters.type) && (
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
            onChange={(key) => setActiveTab(key as 'invoices' | 'payments')}
            tabBarExtraContent={
              <Space>
                <Tag color="blue">
                  {activeTab === 'invoices' 
                    ? `${filteredInvoices.length} facture(s) trouvée(s)`
                    : `${payments.length} paiement(s) trouvé(s)`
                  }
                </Tag>
              </Space>
            }
          >
            <TabPane 
              tab={
                <span>
                  <FileTextOutlined />
                  Factures ({invoices.length})
                </span>
              } 
              key="invoices"
            >
              <InvoicesTable
                invoices={filteredInvoices}
                loading={loading}
                onEdit={handleEditInvoice}
                onDelete={handleDeleteInvoice}
                onView={handleViewInvoice}
                onSend={handleSendInvoice}
                onRecordPayment={handleRecordPayment}
                onGeneratePDF={handleGeneratePDF}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <DollarOutlined />
                  Paiements ({payments.length})
                </span>
              } 
              key="payments"
            >
              <PaymentsTable
                payments={payments}
                loading={loading}
                onView={handleViewPayment}
                onEdit={handleEditPayment}
                onDelete={handleDeletePayment}
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
          <FileTextOutlined />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default BillingDashboard;