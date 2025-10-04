import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Switch,
  Modal,
  Form,
  message,
  Tree,
  Row,
  Col,
  Statistic,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { ChartAccount, AccountClass } from '../../../types';
import { useChartOfAccounts } from '../../../hooks/comptabilite/module_three/useChartOfAccounts';
import { useSYSCOHADACompliance } from '../../../hooks/comptabilite/module_three/useSYSCOHADACompliance';

const { Search } = Input;

interface ComptaPlanComptableProps {
  onEditAccount?: (account: ChartAccount) => void;
  onAddAccount?: (parentAccount?: ChartAccount) => void;
}

const ComptaPlanComptable: React.FC<ComptaPlanComptableProps> = ({
  onEditAccount,
  onAddAccount
}) => {
  const { 
    accounts, 
    loading, 
    deleteAccount,
    getAccountHierarchy,
    searchAccounts 
  } = useChartOfAccounts();

  const { checkCompliance } = useSYSCOHADACompliance();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedClass, setSelectedClass] = useState<AccountClass | 'all'>('all');
  const [complianceModal, setComplianceModal] = useState(false);

  // Filtrer les comptes
  const filteredAccounts = accounts.filter(account => {
    if (!showInactive && !account.isActive) return false;
    if (selectedClass !== 'all' && account.class !== selectedClass) return false;
    if (searchQuery) {
      return account.code.includes(searchQuery) || 
             account.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Préparer les données pour l'arborescence
  const treeData = React.useMemo(() => {
    const hierarchy = getAccountHierarchy();
    const rootAccounts = accounts.filter(acc => !acc.parentId && acc.isActive);

    const buildTree = (account: ChartAccount): any => {
      const children = hierarchy[account.id] || [];
      return {
        key: account.id,
        title: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 8 }}>{account.code}</span>
              <span>{account.name}</span>
            </div>
            <Space>
              {account.isAuxiliary && <Tag color="blue">Auxiliaire</Tag>}
              {account.isReconcilable && <Tag color="green">Rapprochable</Tag>}
              {!account.isActive && <Tag color="red">Inactif</Tag>}
            </Space>
          </div>
        ),
        children: children.filter(child => showInactive || child.isActive).map(buildTree),
        account
      };
    };

    return rootAccounts.map(buildTree);
  }, [accounts, getAccountHierarchy, showInactive]);

  const handleDeleteAccount = async (account: ChartAccount) => {
    Modal.confirm({
      title: `Supprimer le compte ${account.code} ?`,
      content: `Êtes-vous sûr de vouloir désactiver le compte ${account.code} - ${account.name} ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          await deleteAccount(account.id);
          message.success('Compte désactivé avec succès');
        } catch (error) {
          message.error('Erreur lors de la désactivation du compte');
        }
      }
    });
  };

  const handleComplianceCheck = () => {
    const report = checkCompliance(accounts);
    setComplianceModal(true);
  };

  const classNames = {
    '1': 'Ressources durables',
    '2': 'Actif immobilisé',
    '3': 'Stocks',
    '4': 'Tiers',
    '5': 'Trésorerie',
    '6': 'Charges',
    '7': 'Produits',
    '8': 'Autres charges/produits',
    '9': 'Comptabilité analytique'
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      sorter: (a: ChartAccount, b: ChartAccount) => a.code.localeCompare(b.code),
      render: (code: string) => <strong>{code}</strong>
    },
    {
      title: 'Nom du compte',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ChartAccount) => (
        <div>
          <div>{name}</div>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
          )}
        </div>
      )
    },
    {
      title: 'Classe',
      dataIndex: 'class',
      key: 'class',
      width: 80,
      render: (cls: AccountClass) => (
        <Tag color={
          cls === '1' ? 'purple' :
          cls === '2' ? 'blue' :
          cls === '4' ? 'green' :
          cls === '5' ? 'cyan' :
          cls === '6' ? 'volcano' :
          cls === '7' ? 'orange' : 'default'
        }>
          Classe {cls}
        </Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={
          type === 'ASSET' ? 'blue' :
          type === 'LIABILITY' ? 'red' :
          type === 'EQUITY' ? 'purple' :
          type === 'INCOME' ? 'green' :
          type === 'EXPENSE' ? 'orange' : 'default'
        }>
          {type === 'ASSET' ? 'Actif' :
           type === 'LIABILITY' ? 'Passif' :
           type === 'EQUITY' ? 'Capitaux' :
           type === 'INCOME' ? 'Produit' : 'Charge'}
        </Tag>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Actif' : 'Inactif'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: ChartAccount) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => onEditAccount?.(record)}
          >
            Modifier
          </Button>
          <Button 
            size="small" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteAccount(record)}
            disabled={!record.isActive}
          >
            Supprimer
          </Button>
        </Space>
      )
    }
  ];

  const complianceReport = checkCompliance(accounts);

  return (
    <div>
      {/* En-tête avec statistiques */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Comptes"
              value={accounts.length}
              suffix={`/ ${Object.keys(classNames).length} classes`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Comptes Actifs"
              value={accounts.filter(acc => acc.isActive).length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Comptes Auxiliaires"
              value={accounts.filter(acc => acc.isAuxiliary).length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Conformité SYSCOHADA"
              value={complianceReport.score}
              suffix="%"
              prefix={complianceReport.isCompliant ? 
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                <WarningOutlined style={{ color: '#faad14' }} />
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Barre d'outils */}
      <Card 
        title="Plan Comptable SYSCOHADA"
        extra={
          <Space>
            <Button 
              icon={<FileExcelOutlined />}
              onClick={handleComplianceCheck}
            >
              Vérifier Conformité
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => onAddAccount?.()}
            >
              Nouveau Compte
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="Rechercher par code ou nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              style={{ width: 200 }}
              placeholder="Filtrer par classe"
            >
              <Select.Option value="all">Toutes les classes</Select.Option>
              {Object.entries(classNames).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  Classe {value} - {label}
                </Select.Option>
              ))}
            </Select>

            <Switch
              checked={showInactive}
              onChange={setShowInactive}
              checkedChildren="Avec inactifs"
              unCheckedChildren="Actifs seulement"
            />
          </Space>

          <div>
            {searchQuery && (
              <Tag color="blue">
                {filteredAccounts.length} compte(s) trouvé(s)
              </Tag>
            )}
          </div>
        </Space>

        {/* Vue tableau */}
        <Table
          columns={columns}
          dataSource={filteredAccounts}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} sur ${total} comptes`
          }}
          scroll={{ x: 800 }}
        />

        {/* Vue arborescence (optionnelle) */}
        <Card 
          title="Vue Hiérarchique" 
          size="small" 
          style={{ marginTop: 16 }}
        >
          <Tree
            treeData={treeData}
            defaultExpandAll
            onSelect={(_, { node }) => {
              const account = (node as any).account;
              if (account) {
                onEditAccount?.(account);
              }
            }}
          />
        </Card>
      </Card>

      {/* Modal de conformité */}
      <Modal
        title="Rapport de Conformité SYSCOHADA"
        open={complianceModal}
        onCancel={() => setComplianceModal(false)}
        footer={[
          <Button key="close" onClick={() => setComplianceModal(false)}>
            Fermer
          </Button>
        ]}
        width={800}
      >
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Statistic
              title="Score de Conformité"
              value={complianceReport.score}
              suffix="%"
              valueStyle={{
                color: complianceReport.isCompliant ? '#52c41a' : '#faad14'
              }}
            />
            <Tag color={complianceReport.isCompliant ? 'green' : 'orange'} style={{ marginTop: 8 }}>
              {complianceReport.isCompliant ? 'CONFORME' : 'NON CONFORME'}
            </Tag>
          </div>

          <Row gutter={16} style={{ marginBottom: 24 }}>
            {Object.entries(complianceReport.checks).map(([key, value]) => (
              <Col span={8} key={key}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    {value ? (
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
                    ) : (
                      <WarningOutlined style={{ color: '#faad14', fontSize: 24 }} />
                    )}
                    <div style={{ marginTop: 8 }}>
                      {key === 'structure' && 'Structure'}
                      {key === 'mandatoryAccounts' && 'Comptes obligatoires'}
                      {key === 'numbering' && 'Numérotation'}
                      {key === 'hierarchy' && 'Hiérarchie'}
                      {key === 'naming' && 'Nommage'}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {complianceReport.recommendations.length > 0 && (
            <div>
              <h4>Recommandations :</h4>
              <ul>
                {complianceReport.recommendations.map((rec, index) => (
                  <li key={index} style={{ marginBottom: 8 }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ComptaPlanComptable;