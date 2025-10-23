import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Modal, Form, Input, Select, Alert, Tree, Statistic, Switch } from 'antd';
import { motion } from 'framer-motion';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useAccountConfiguration } from '../../../hooks/comptabilite/module_three/useAccountConfiguration';
import { ChartAccount, AccountClass, AccountType } from '../../../types';

const { Option } = Select;
const { TextArea } = Input;

export const ComptaConfigComptes: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  
  const {
    accounts,
    loading,
    error,
    createAccount,
    // updateAccount,
    deleteAccount,
    selectedAccount,
    setSelectedAccount,
    // validateAccount,
    // classRules,
    getAccountsByClass,
    getAccountHierarchy
  } = useAccountConfiguration();

  const handleCreateAccount = async (values: any) => {
    try {
      await createAccount({
        code: values.code,
        name: values.name,
        class: values.class,
        type: values.type,
        parentId: values.parentId || undefined,
        level: values.parentId ? 2 : 1,
        isAuxiliary: values.isAuxiliary || false,
        isReconcilable: values.isReconcilable || false,
        isActive: true,
        description: values.description,
        entity: 'default'
      });
      
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error('Erreur création compte:', err);
    }
  };

  const handleDeactivateAccount = async (accountId: string) => {
    try {
      await deleteAccount(accountId);
    } catch (err) {
      console.error('Erreur désactivation compte:', err);
    }
  };

  const classDescriptions = {
    '1': 'Ressources durables - Capital, réserves, emprunts',
    '2': 'Actif immobilisé - Immobilisations, amortissements', 
    '3': 'Stocks - Marchandises, matières premières',
    '4': 'Tiers - Clients, fournisseurs, personnel',
    '5': 'Trésorerie - Banques, caisse, placements',
    '6': 'Charges - Achats, services, personnel',
    '7': 'Produits - Ventes, subventions, production',
    '8': 'Autres charges et produits - HAO, participations',
    '9': 'Comptabilité analytique - Sections analytiques'
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: string) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: 'Classe',
      dataIndex: 'class',
      key: 'class',
      width: 80,
      render: (cls: string) => <Tag color="purple">Classe {cls}</Tag>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: AccountType) => (
        <Tag color={
          type === 'ASSET' ? 'green' : 
          type === 'LIABILITY' ? 'red' : 
          type === 'EQUITY' ? 'orange' : 
          type === 'INCOME' ? 'cyan' : 'magenta'
        }>
          {type}
        </Tag>
      )
    },
    {
      title: 'Auxiliaire',
      dataIndex: 'isAuxiliary',
      key: 'isAuxiliary',
      width: 100,
      render: (aux: boolean) => aux ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : '-'
    },
    {
      title: 'Rapprochable',
      dataIndex: 'isReconcilable',
      key: 'isReconcilable',
      width: 120,
      render: (rec: boolean) => rec ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: ChartAccount) => (
        <Button.Group size="small">
          <Button 
            icon={<EyeOutlined />}
            onClick={() => setSelectedAccount(record)}
          >
            Détail
          </Button>
          <Button 
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeactivateAccount(record.id)}
          >
            Désactiver
          </Button>
        </Button.Group>
      )
    }
  ];

  const treeData = getAccountHierarchy().map(root => ({
    key: root.id,
    title: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          <Tag color="blue">{root.code}</Tag>
          {root.name}
        </span>
        <Tag color="purple">Classe {root.class}</Tag>
      </div>
    ),
    children: root.children.map(child => ({
      key: child.id,
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <Tag color="cyan">{child.code}</Tag>
            {child.name}
          </span>
          <div>
            {child.isAuxiliary && <Tag color="green">Aux</Tag>}
            {child.isReconcilable && <Tag color="orange">Rappro</Tag>}
          </div>
        </div>
      )
    }))
  }));

  const filteredAccounts = selectedClass === 'all' 
    ? accounts 
    : getAccountsByClass(selectedClass);

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
            Configuration du Plan Comptable
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Select 
              value={selectedClass} 
              onChange={setSelectedClass}
              style={{ width: 120 }}
            >
              <Option value="all">Toutes classes</Option>
              {[1,2,3,4,5,6,7,8,9].map(cls => (
                <Option key={cls} value={cls.toString()}>Classe {cls}</Option>
              ))}
            </Select>
            
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            >
              Liste
            </Button>
            <Button 
              type={viewMode === 'tree' ? 'primary' : 'default'}
              onClick={() => setViewMode('tree')}
            >
              Arborescence
            </Button>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Nouveau Compte
            </Button>
          </div>
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
                title="Total Comptes"
                value={accounts.length}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Comptes Auxiliaires"
                value={accounts.filter(acc => acc.isAuxiliary).length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Comptes Rapprochables"
                value={accounts.filter(acc => acc.isReconcilable).length}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Conformité SYSCOHADA"
                value={95}
                suffix="%"
                valueStyle={{ color: '#389e0d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Affichage selon le mode */}
        {viewMode === 'list' ? (
          <Table
            columns={columns}
            dataSource={filteredAccounts}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
            scroll={{ y: 400 }}
          />
        ) : (
          <Card title="Arborescence du Plan Comptable" size="small">
            <Tree
              treeData={treeData}
              defaultExpandAll
              style={{ maxHeight: 500, overflow: 'auto' }}
            />
          </Card>
        )}

        {/* Modal de création */}
        <Modal
          title="Nouveau Compte Comptable"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateAccount}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="class"
                  label="Classe Comptable"
                  rules={[{ required: true, message: 'La classe est requise' }]}
                >
                  <Select placeholder="Sélectionner une classe">
                    {Object.entries(classDescriptions).map(([cls, desc]) => (
                      <Option key={cls} value={cls}>
                        Classe {cls} - {desc}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type de Compte"
                  rules={[{ required: true, message: 'Le type est requis' }]}
                >
                  <Select placeholder="Sélectionner le type">
                    <Option value="ASSET">Actif</Option>
                    <Option value="LIABILITY">Passif</Option>
                    <Option value="EQUITY">Capitaux propres</Option>
                    <Option value="INCOME">Produit</Option>
                    <Option value="EXPENSE">Charge</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="Code Compte"
                  rules={[
                    { required: true, message: 'Le code est requis' },
                    { pattern: /^\d{2,6}$/, message: '2-6 chiffres requis' }
                  ]}
                >
                  <Input placeholder="Ex: 411000" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="parentId"
                  label="Compte Parent"
                >
                  <Select placeholder="Optionnel - Compte parent">
                    {accounts.filter(acc => !acc.parentId).map(acc => (
                      <Option key={acc.id} value={acc.id}>
                        {acc.code} - {acc.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="name"
              label="Nom du Compte"
              rules={[{ required: true, message: 'Le nom est requis' }]}
            >
              <Input placeholder="Ex: Clients" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea placeholder="Description optionnelle du compte" rows={3} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="isAuxiliary"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Compte Auxiliaire</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isReconcilable"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Rapprochable</span>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Créer le Compte
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal de détail */}
        {selectedAccount && (
          <Modal
            title={`Détail Compte ${selectedAccount.code}`}
            open={!!selectedAccount}
            onCancel={() => setSelectedAccount(null)}
            footer={[
              <Button key="close" onClick={() => setSelectedAccount(null)}>
                Fermer
              </Button>
            ]}
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Code">{selectedAccount.code}</Descriptions.Item>
              <Descriptions.Item label="Nom">{selectedAccount.name}</Descriptions.Item>
              <Descriptions.Item label="Classe">Classe {selectedAccount.class}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedAccount.type}</Descriptions.Item>
              <Descriptions.Item label="Auxiliaire">
                {selectedAccount.isAuxiliary ? 'Oui' : 'Non'}
              </Descriptions.Item>
              <Descriptions.Item label="Rapprochable">
                {selectedAccount.isReconcilable ? 'Oui' : 'Non'}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedAccount.description || 'Aucune'}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        )}
      </Card>
    </motion.div>
  );
};

export default ComptaConfigComptes;