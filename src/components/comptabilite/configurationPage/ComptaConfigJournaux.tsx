// src/components/comptabilite/configurationPage/ComptaConfigJournaux.tsx
import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Modal, Form, Input, Select, Alert, Descriptions, Statistic, Switch, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { 
  PlusOutlined, 
//   EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  BookOutlined,
  CheckCircleOutlined,
//   CloseCircleOutlined,
//   SettingOutlined
} from '@ant-design/icons';
import { useJournalManagement} from '../../../hooks/comptabilite/module_four/useJournalManagement'
import { Journal, JournalType } from '../../../types';

const { Option } = Select;
const { TextArea } = Input;

export const ComptaConfigJournaux: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  
  const {
    journals,
    journalStatus,
    loading,
    error,
    createJournal,
    updateJournal,
    deactivateJournal,
    selectedJournal,
    setSelectedJournal,
    journalRules,
    getAvailableJournalTypes
  } = useJournalConfiguration();

  const handleCreateJournal = async (values: any) => {
    try {
      await createJournal({
        code: values.code,
        name: values.name,
        type: values.type,
        entity: 'default',
        sequenceId: `seq-${values.code.toLowerCase()}`,
        isActive: true,
        requiresApproval: values.requiresApproval || false,
        approvalLevel: values.approvalLevel || 1,
        defaultAccounts: {
          cashAccount: values.cashAccount,
          bankAccount: values.bankAccount,
          customerAccount: values.customerAccount,
          supplierAccount: values.supplierAccount
        }
      });
      
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error('Erreur création journal:', err);
    }
  };

  const handleDeactivateJournal = async (journalId: string) => {
    try {
      await deactivateJournal(journalId);
    } catch (err) {
      console.error('Erreur désactivation journal:', err);
    }
  };

  const getJournalStatusInfo = (journalId: string) => {
    return journalStatus.find(js => js.journalId === journalId);
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 80,
      render: (code: string) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: JournalType) => (
        <Tag color={
          type === 'GEN' ? 'purple' :
          type === 'VTE' ? 'green' :
          type === 'ACH' ? 'orange' :
          type === 'BNQ' ? 'cyan' : 'magenta'
        }>
          {type}
        </Tag>
      )
    },
    {
      title: 'Statut',
      key: 'status',
      width: 120,
      render: (_, record: Journal) => {
        const status = getJournalStatusInfo(record.id);
        return status ? (
          <Tag color={status.isClosed ? 'red' : 'green'}>
            {status.isClosed ? 'Clôturé' : 'Actif'}
          </Tag>
        ) : <Tag>Inactif</Tag>;
      }
    },
    {
      title: 'Approbation',
      dataIndex: 'requiresApproval',
      key: 'requiresApproval',
      width: 100,
      render: (requires: boolean) => 
        requires ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : '-'
    },
    {
      title: 'Écritures',
      key: 'entries',
      width: 100,
      render: (_, record: Journal) => {
        const status = getJournalStatusInfo(record.id);
        return status ? status.totalEntries : 0;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: Journal) => (
        <Button.Group size="small">
          <Button 
            icon={<EyeOutlined />}
            onClick={() => setSelectedJournal(record)}
          >
            Détail
          </Button>
          <Button 
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeactivateJournal(record.id)}
          >
            Désactiver
          </Button>
        </Button.Group>
      )
    }
  ];

  const availableTypes = getAvailableJournalTypes();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOutlined />
            Configuration des Journaux Comptables
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            disabled={availableTypes.length === 0}
          >
            Nouveau Journal
          </Button>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        {/* Statistiques */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Journaux Actifs"
                value={journals.length}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Avec Approbation"
                value={journals.filter(j => j.requiresApproval).length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Écritures Total"
                value={journalStatus.reduce((sum, js) => sum + js.totalEntries, 0)}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Types Disponibles"
                value={availableTypes.length}
                valueStyle={{ color: '#389e0d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table des journaux */}
        <Table
          columns={columns}
          dataSource={journals}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ y: 400 }}
        />

        {/* Modal de création/édition */}
        <Modal
          title={editingJournal ? "Modifier le Journal" : "Nouveau Journal Comptable"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingJournal(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateJournal}
            initialValues={{
              requiresApproval: false,
              approvalLevel: 1
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type de Journal"
                  rules={[{ required: true, message: 'Le type est requis' }]}
                >
                  <Select 
                    placeholder="Sélectionner le type"
                    disabled={!!editingJournal}
                  >
                    {availableTypes.map(type => (
                      <Option key={type} value={type}>
                        {type} - {journalRules[type]?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="Code Journal"
                  rules={[
                    { required: true, message: 'Le code est requis' },
                    { pattern: /^[A-Z]{3}$/, message: '3 lettres majuscules requis' }
                  ]}
                >
                  <Input 
                    placeholder="Ex: VTE" 
                    disabled={!!editingJournal}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="name"
              label="Nom du Journal"
              rules={[{ required: true, message: 'Le nom est requis' }]}
            >
              <Input placeholder="Ex: Journal des Ventes" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="requiresApproval"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Nécessite approbation</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="approvalLevel"
                  label="Niveau d'approbation"
                >
                  <Select>
                    <Option value={1}>Niveau 1</Option>
                    <Option value={2}>Niveau 2</Option>
                    <Option value={3}>Niveau 3</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Card title="Comptes par Défaut" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="cashAccount"
                    label="Compte Caisse"
                  >
                    <Select placeholder="Ex: 571000" showSearch>
                      <Option value="571000">571000 - Caisse principale</Option>
                      <Option value="571100">571100 - Caisse secondaire</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="bankAccount"
                    label="Compte Banque"
                  >
                    <Select placeholder="Ex: 512000" showSearch>
                      <Option value="512000">512000 - Banque principale</Option>
                      <Option value="512100">512100 - Banque secondaire</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="customerAccount"
                    label="Compte Clients"
                  >
                    <Select placeholder="Ex: 411000" showSearch>
                      <Option value="411000">411000 - Clients</Option>
                      <Option value="411100">411100 - Clients divers</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="supplierAccount"
                    label="Compte Fournisseurs"
                  >
                    <Select placeholder="Ex: 401000" showSearch>
                      <Option value="401000">401000 - Fournisseurs</Option>
                      <Option value="401100">401100 - Fournisseurs divers</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 16 }}>
              <Button 
                onClick={() => {
                  setModalVisible(false);
                  setEditingJournal(null);
                  form.resetFields();
                }} 
                style={{ marginRight: 8 }}
              >
                Annuler
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingJournal ? 'Modifier' : 'Créer'} le Journal
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal de détail */}
        {selectedJournal && (
          <Modal
            title={`Détail Journal ${selectedJournal.code}`}
            open={!!selectedJournal}
            onCancel={() => setSelectedJournal(null)}
            footer={[
              <Button key="close" onClick={() => setSelectedJournal(null)}>
                Fermer
              </Button>
            ]}
            width={700}
          >
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Code" span={1}>
                <Tag color="blue">{selectedJournal.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Type" span={1}>
                <Tag color="purple">{selectedJournal.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nom" span={2}>
                {selectedJournal.name}
              </Descriptions.Item>
              <Descriptions.Item label="Approbation Requise">
                {selectedJournal.requiresApproval ? 'Oui' : 'Non'}
              </Descriptions.Item>
              <Descriptions.Item label="Niveau d'Approbation">
                {selectedJournal.approvalLevel}
              </Descriptions.Item>
              
              {selectedJournal.defaultAccounts && (
                <>
                  <Descriptions.Item label="Comptes par Défaut" span={2}>
                    <div style={{ marginTop: 8 }}>
                      {selectedJournal.defaultAccounts.cashAccount && (
                        <div>💵 Caisse: {selectedJournal.defaultAccounts.cashAccount}</div>
                      )}
                      {selectedJournal.defaultAccounts.bankAccount && (
                        <div>🏦 Banque: {selectedJournal.defaultAccounts.bankAccount}</div>
                      )}
                      {selectedJournal.defaultAccounts.customerAccount && (
                        <div>👥 Clients: {selectedJournal.defaultAccounts.customerAccount}</div>
                      )}
                      {selectedJournal.defaultAccounts.supplierAccount && (
                        <div>📦 Fournisseurs: {selectedJournal.defaultAccounts.supplierAccount}</div>
                      )}
                    </div>
                  </Descriptions.Item>
                </>
              )}

              <Descriptions.Item label="Statut Actuel" span={2}>
                {getJournalStatusInfo(selectedJournal.id) ? (
                  <div>
                    <Tag color={getJournalStatusInfo(selectedJournal.id)!.isClosed ? 'red' : 'green'}>
                      {getJournalStatusInfo(selectedJournal.id)!.isClosed ? 'Clôturé' : 'Actif'}
                    </Tag>
                    <div style={{ marginTop: 4 }}>
                      Écritures: {getJournalStatusInfo(selectedJournal.id)!.totalEntries}
                    </div>
                  </div>
                ) : (
                  <Tag color="default">Inactif</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        )}
      </Card>
    </motion.div>
  );
};

export default ComptaConfigJournaux;