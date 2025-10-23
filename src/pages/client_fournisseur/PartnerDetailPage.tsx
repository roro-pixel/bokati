import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Tabs,
  Table,
  Statistic,
  Progress,
  Divider,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  PhoneOutlined, 
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  WarningOutlined,
  // TeamOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { usePartners } from '../../hooks/clients_fournisseurs/usePartners';
import { BusinessPartner, PaymentHistory } from '../../types';
import PartnerContacts from '../../components/partners/PartnerContacts';
import PartnerForm from '../../components/partners/PartnerForm';

const { TabPane } = Tabs;

const PartnerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { partners, getPartnerById, updatePartner, loading } = usePartners();
  const [partner, setPartner] = useState<BusinessPartner | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPartner = getPartnerById(id);
      if (foundPartner) {
        setPartner(foundPartner);
      } else {
        message.error('Partenaire non trouvé');
        navigate('/partenaires');
      }
    }
  }, [id, partners, getPartnerById, navigate]);

  const handleUpdatePartner = async (values: any) => {
    if (!partner) return;
    
    try {
      await updatePartner(partner.id, values);
      setIsEditing(false);
      message.success('Partenaire mis à jour avec succès');
    } catch (err) {
      message.error('Erreur lors de la mise à jour');
    }
  };

  const handleContactsUpdate = (newContacts: any[]) => {
    if (partner) {
      updatePartner(partner.id, { contacts: newContacts });
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'FAIBLE': return 'success';
      case 'MOYEN': return 'warning';
      case 'ELEVE': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'VIP': return 'gold';
      case 'STRATEGIQUE': return 'purple';
      case 'RISQUE': return 'red';
      default: return 'blue';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'CLIENT' ? 'blue' : 'green';
  };

  const paymentHistoryColumns = [
    {
      title: 'Document',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
    },
    {
      title: 'Type',
      dataIndex: 'documentType',
      key: 'documentType',
      render: (type: string) => (
        <Tag color={type === 'FACTURE' ? 'blue' : 'orange'}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Échéance',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: Date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>
          {amount.toLocaleString()} FCFA
        </span>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: PaymentHistory) => {
        const isOverdue = record.delayDays > 0;
        const color = status === 'PAYE' ? 'success' : isOverdue ? 'error' : 'warning';
        const text = status === 'PAYE' ? 'Payé' : isOverdue ? `Retard (${record.delayDays}j)` : 'En attente';
        
        return <Tag color={color}>{text}</Tag>;
      }
    }
  ];

  if (!partner) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        Chargement...
      </div>
    );
  }

  const primaryContact = partner.contacts.find(contact => contact.isPrimary);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* En-tête */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/partenaires')}
              >
                Retour
              </Button>
              <div>
                <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {partner.type === 'CLIENT' ? '👤' : '🏭'}
                  {partner.name}
                </h1>
                <Space style={{ marginTop: 8 }}>
                  <Tag color={getTypeColor(partner.type)}>
                    {partner.type === 'CLIENT' ? 'Client' : 'Fournisseur'}
                  </Tag>
                  <Tag color={getCategoryColor(partner.category)}>
                    {partner.category}
                  </Tag>
                  <Tag color={getRiskColor(partner.riskLevel)}>
                    Risque: {partner.riskLevel}
                  </Tag>
                  <Tag color={partner.isActive ? 'success' : 'default'}>
                    {partner.isActive ? 'Actif' : 'Inactif'}
                  </Tag>
                </Space>
              </div>
            </Space>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </Button>
          </Col>
        </Row>
      </Card>

      {isEditing ? (
        <PartnerForm
          partner={partner}
          onSubmit={handleUpdatePartner}
          onCancel={() => setIsEditing(false)}
          loading={loading}
        />
      ) : (
        <Row gutter={16}>
          {/* Colonne gauche - Informations générales */}
          <Col span={16}>
            <Tabs defaultActiveKey="informations">
              <TabPane tab="Informations Générales" key="informations">
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="Coordonnées" style={{ marginBottom: 16 }}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Adresse">
                          <Space>
                            <EnvironmentOutlined />
                            {partner.address}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ville">
                          {partner.city}
                        </Descriptions.Item>
                        <Descriptions.Item label="Pays">
                          {partner.country}
                        </Descriptions.Item>
                        <Descriptions.Item label="Téléphone">
                          <Space>
                            <PhoneOutlined />
                            {partner.phone}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                          <Space>
                            <MailOutlined />
                            {partner.email}
                          </Space>
                        </Descriptions.Item>
                        {partner.website && (
                          <Descriptions.Item label="Site web">
                            <Space>
                              <GlobalOutlined />
                              <a href={partner.website} target="_blank" rel="noopener noreferrer">
                                {partner.website}
                              </a>
                            </Space>
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card title="Informations Juridiques" style={{ marginBottom: 16 }}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Forme juridique">
                          {partner.legalForm}
                        </Descriptions.Item>
                        <Descriptions.Item label="NIU">
                          {partner.taxId}
                        </Descriptions.Item>
                        {partner.rccm && (
                          <Descriptions.Item label="RCCM">
                            {partner.rccm}
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Secteur d'activité">
                          {partner.activitySector}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date de création">
                          {new Date(partner.createdAt).toLocaleDateString('fr-FR')}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Card title="Conditions Commerciales">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Conditions de paiement">
                          {partner.paymentTerms}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mode de paiement">
                          {partner.paymentMethod}
                        </Descriptions.Item>
                        <Descriptions.Item label="Taux de remise">
                          {partner.discountRate}%
                        </Descriptions.Item>
                        <Descriptions.Item label="Limite de crédit">
                          <DollarOutlined /> {partner.creditLimit.toLocaleString()} FCFA
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Contacts" key="contacts">
                <PartnerContacts
                  contacts={partner.contacts}
                  partnerId={partner.id}
                  onContactsUpdate={handleContactsUpdate}
                />
              </TabPane>

              <TabPane tab="Historique Paiements" key="payments">
                <Card>
                  <Table
                    columns={paymentHistoryColumns}
                    dataSource={partner.paymentHistory}
                    rowKey="id"
                    pagination={false}
                    locale={{
                      emptyText: 'Aucun historique de paiement'
                    }}
                  />
                </Card>
              </TabPane>
            </Tabs>
          </Col>

          {/* Colonne droite - Statistiques et résumé */}
          <Col span={8}>
            <Card title="Aperçu Financier" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Statistic
                  title="Solde Actuel"
                  value={partner.currentBalance}
                  precision={0}
                  valueStyle={{
                    color: partner.currentBalance > 0 ? '#ff4d4f' : '#52c41a'
                  }}
                  prefix={<DollarOutlined />}
                  suffix="FCFA"
                />

                <Divider style={{ margin: '12px 0' }} />

                <Statistic
                  title="Encaissements en attente"
                  value={partner.outstandingBalance}
                  precision={0}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<WarningOutlined />}
                  suffix="FCFA"
                />

                <Progress
                  percent={Math.min(100, (partner.outstandingBalance / partner.creditLimit) * 100)}
                  status={
                    partner.outstandingBalance > partner.creditLimit ? 'exception' : 'active'
                  }
                  format={percent => `Utilisation: ${percent}%`}
                />

                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Limite de crédit">
                    {partner.creditLimit.toLocaleString()} FCFA
                  </Descriptions.Item>
                  <Descriptions.Item label="Score de risque">
                    <Progress 
                      percent={partner.riskScore} 
                      size="small"
                      status={
                        partner.riskScore > 80 ? 'exception' : 
                        partner.riskScore > 60 ? 'active' : 'success'
                      }
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Card>

            {primaryContact && (
              <Card title="Contact Principal">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Nom">
                    {primaryContact.firstName} {primaryContact.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Poste">
                    {primaryContact.position}
                  </Descriptions.Item>
                  {primaryContact.department && (
                    <Descriptions.Item label="Département">
                      {primaryContact.department}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Téléphone">
                    <Space>
                      <PhoneOutlined />
                      {primaryContact.phone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      <a href={`mailto:${primaryContact.email}`}>
                        {primaryContact.email}
                      </a>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </motion.div>
  );
};

export default PartnerDetailPage;