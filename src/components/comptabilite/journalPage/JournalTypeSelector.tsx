import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Space,
  Typography 
} from 'antd';
import { 
  FileTextOutlined, 
  ShoppingOutlined, 
  BankOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { JournalType } from '../../../types';

const { Text } = Typography;

interface JournalTypeSelectorProps {
  selectedType?: JournalType;
  onTypeSelect: (type: JournalType) => void;
  disabled?: boolean;
}

const JournalTypeSelector: React.FC<JournalTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  disabled = false
}) => {
  const journalTypes = [
    {
      type: 'GEN' as JournalType,
      name: 'Journal Général',
      icon: <FileTextOutlined />,
      color: '#1890ff',
      description: 'Transactions diverses et écritures de régularisation',
      usage: 'Ajustements, provisions, amortissements',
      accounts: ['Tous comptes']
    },
    {
      type: 'VTE' as JournalType,
      name: 'Journal des Ventes', 
      icon: <ShoppingOutlined />,
      color: '#52c41a',
      description: 'Transactions clients et ventes',
      usage: 'Factures clients, avoirs, encaissements',
      accounts: ['411000 Clients', '701000 Ventes', '445660 TVA']
    },
    {
      type: 'ACH' as JournalType,
      name: 'Journal des Achats',
      icon: <ShoppingOutlined />,
      color: '#fa8c16', 
      description: 'Transactions fournisseurs et achats',
      usage: 'Factures fournisseurs, notes de crédit, décaissements',
      accounts: ['401000 Fournisseurs', '601000 Achats', '445670 TVA']
    },
    {
      type: 'BNQ' as JournalType,
      name: 'Journal de Banque',
      icon: <BankOutlined />,
      color: '#722ed1',
      description: 'Transactions bancaires',
      usage: 'Virements, chèques, prélèvements, agios',
      accounts: ['512000 Banque', '571000 Caisse']
    },
    {
      type: 'CAI' as JournalType,
      name: 'Journal de Caisse',
      icon: <MoneyCollectOutlined />,
      color: '#fa541c',
      description: 'Transactions de caisse',
      usage: 'Encaissements espèces, paiements espèces, fonds de caisse',
      accounts: ['571000 Caisse', '512000 Banque']
    }
  ];

  return (
    <Card title="Sélection du Type de Journal" size="small">
      <Row gutter={[16, 16]}>
        {journalTypes.map(journal => (
          <Col span={24} key={journal.type}>
            <div
              style={{
                border: `2px solid ${
                  selectedType === journal.type ? journal.color : '#f0f0f0'
                }`,
                borderRadius: 8,
                padding: 16,
                backgroundColor: selectedType === journal.type ? `${journal.color}08` : '#fff',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1
              }}
              onClick={() => !disabled && onTypeSelect(journal.type)}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Space>
                    <div 
                      style={{ 
                        color: journal.color, 
                        fontSize: '24px',
                        padding: '8px',
                        backgroundColor: `${journal.color}15`,
                        borderRadius: 6
                      }}
                    >
                      {journal.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {journal.name}
                      </div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        Code: <Tag size="small">{journal.type}</Tag>
                      </div>
                    </div>
                  </Space>

                  {selectedType === journal.type && (
                    <CheckOutlined style={{ color: journal.color, fontSize: '16px' }} />
                  )}
                </div>

                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {journal.description}
                </Text>

                <div>
                  <Text strong style={{ fontSize: '12px' }}>Utilisation: </Text>
                  <Text style={{ fontSize: '12px' }}>{journal.usage}</Text>
                </div>

                <div>
                  <Text strong style={{ fontSize: '12px' }}>Comptes typiques: </Text>
                  <Space wrap size={[4, 4]}>
                    {journal.accounts.map((account, index) => (
                      <Tag key={index} color="blue" size="small">
                        {account}
                      </Tag>
                    ))}
                  </Space>
                </div>

                {!disabled && (
                  <div style={{ textAlign: 'right' }}>
                    <Button 
                      type={selectedType === journal.type ? 'primary' : 'default'}
                      size="small"
                      icon={selectedType === journal.type ? <CheckOutlined /> : <SettingOutlined />}
                      style={{ 
                        backgroundColor: selectedType === journal.type ? journal.color : undefined,
                        borderColor: selectedType === journal.type ? journal.color : undefined
                      }}
                    >
                      {selectedType === journal.type ? 'Sélectionné' : 'Sélectionner'}
                    </Button>
                  </div>
                )}
              </Space>
            </div>
          </Col>
        ))}
      </Row>

      {selectedType && (
        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6ffed', borderRadius: 6 }}>
          <Space>
            <CheckOutlined style={{ color: '#52c41a' }} />
            <Text strong>
              {journalTypes.find(j => j.type === selectedType)?.name} sélectionné
            </Text>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default JournalTypeSelector;