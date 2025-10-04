// src/components/comptabilite/comptesPage/SYSCOHADAValidator.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Alert, 
  Progress, 
  List, 
  Tag, 
  Space, 
  Button, 
  Row, 
  Col,
  Statistic,
  Modal,
  Table
} from 'antd';
import { 
  CheckCircleOutlined, 
  WarningOutlined, 
  CloseCircleOutlined,
  InfoCircleOutlined,
  FileExcelOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { ChartAccount } from '../../../types';
import { useSYSCOHADACompliance } from '../../../hooks/comptabilite/module_three/useSYSCOHADACompliance';

interface SYSCOHADAValidatorProps {
  accounts: ChartAccount[];
  onExport?: (report: any) => void;
}

const SYSCOHADAValidator: React.FC<SYSCOHADAValidatorProps> = ({ 
  accounts, 
  onExport 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const { 
    checkCompliance, 
    generateComplianceReport,
    exportSYSCOHADAFormat,
    namingConventions 
  } = useSYSCOHADACompliance();

  const compliance = checkCompliance(accounts);
  const detailedReport = generateComplianceReport(accounts);

  const handleExport = () => {
    const exportData = exportSYSCOHADAFormat(accounts);
    onExport?.(exportData);
  };

  const getCheckIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
  };

  const complianceColumns = [
    {
      title: 'Vérification',
      dataIndex: 'check',
      key: 'check',
      width: 200,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (passed: boolean) => (
        <Tag color={passed ? 'green' : 'red'}>
          {passed ? 'PASS' : 'FAIL'}
        </Tag>
      )
    },
    {
      title: 'Détails',
      dataIndex: 'details',
      key: 'details',
      render: (details: string[]) => (
        <div>
          {details.map((detail, index) => (
            <div key={index} style={{ fontSize: '12px', color: '#666' }}>
              • {detail}
            </div>
          ))}
        </div>
      )
    }
  ];

  const complianceData = [
    {
      key: 'structure',
      check: 'Structure des classes',
      status: compliance.checks.structure,
      details: compliance.checks.structure ? 
        ['Toutes les classes (1-9) sont représentées'] : 
        compliance.details.structureErrors
    },
    {
      key: 'mandatory',
      check: 'Comptes obligatoires',
      status: compliance.checks.mandatoryAccounts,
      details: compliance.checks.mandatoryAccounts ? 
        ['Tous les comptes obligatoires SYSCOHADA sont présents'] : 
        [`Comptes manquants: ${compliance.details.missingAccounts.join(', ')}`]
    },
    {
      key: 'numbering',
      check: 'Système de numérotation',
      status: compliance.checks.numbering,
      details: compliance.checks.numbering ? 
        ['Tous les codes respectent le format SYSCOHADA'] : 
        compliance.details.numberingErrors
    },
    {
      key: 'hierarchy',
      check: 'Hiérarchie des comptes',
      status: compliance.checks.hierarchy,
      details: compliance.checks.hierarchy ? 
        ['La hiérarchie parent-enfant est cohérente'] : 
        compliance.details.hierarchyErrors
    },
    {
      key: 'naming',
      check: 'Conventions de nommage',
      status: compliance.checks.naming,
      details: compliance.checks.naming ? 
        ['Les noms respectent les conventions SYSCOHADA'] : 
        compliance.details.namingWarnings
    }
  ];

  return (
    <div>
      <Card 
        title="Validation SYSCOHADA" 
        extra={
          <Space>
            <Button 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              Exporter
            </Button>
            <Button 
              type="primary"
              icon={<InfoCircleOutlined />}
              onClick={() => setShowDetails(true)}
            >
              Détails
            </Button>
          </Space>
        }
      >
        {/* Score principal */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Progress
            type="circle"
            percent={compliance.score}
            format={percent => (
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {percent}%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Conformité
                </div>
              </div>
            )}
            strokeColor={
              compliance.score >= 90 ? '#52c41a' :
              compliance.score >= 70 ? '#faad14' : '#ff4d4f'
            }
            size={120}
          />
          
          <div style={{ marginTop: 16 }}>
            <Tag 
              color={compliance.isCompliant ? 'green' : 'orange'} 
              style={{ fontSize: '14px', padding: '4px 12px' }}
            >
              {compliance.isCompliant ? 'CONFORME SYSCOHADA' : 'NON CONFORME'}
            </Tag>
          </div>
        </div>

        {/* Statistiques */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic
              title="Total Comptes"
              value={detailedReport.statistics.totalAccounts}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Comptes Actifs"
              value={detailedReport.statistics.activeAccounts}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Auxiliaires"
              value={detailedReport.statistics.auxiliaryAccounts}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Rapprochables"
              value={detailedReport.statistics.reconcilableAccounts}
            />
          </Col>
        </Row>

        {/* Résumé des vérifications */}
        <Table
          columns={complianceColumns}
          dataSource={complianceData}
          pagination={false}
          size="small"
          style={{ marginBottom: 16 }}
        />

        {/* Recommandations */}
        {compliance.recommendations.length > 0 && (
          <Alert
            message="Recommandations pour la conformité"
            description={
              <ul style={{ margin: 0 }}>
                {compliance.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            }
            type="warning"
            showIcon
          />
        )}

        {compliance.isCompliant && (
          <Alert
            message="Plan comptable conforme"
            description="Votre plan comptable respecte toutes les normes SYSCOHADA"
            type="success"
            showIcon
          />
        )}
      </Card>

      {/* Modal détaillé */}
      <Modal
        title="Rapport Détaillé de Conformité SYSCOHADA"
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetails(false)}>
            Fermer
          </Button>
        ]}
        width={1000}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Répartition par classe */}
          <Card title="Répartition par Classe" size="small">
            <Row gutter={16}>
              {Object.entries(detailedReport.statistics.accountsByClass).map(([cls, count]) => (
                <Col span={4} key={cls}>
                  <Statistic
                    title={`Classe ${cls}`}
                    value={count}
                    valueStyle={{
                      color: count > 0 ? '#1890ff' : '#ff4d4f',
                      fontSize: '18px'
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Card>

          {/* Comptes obligatoires manquants */}
          {compliance.details.missingAccounts.length > 0 && (
            <Card title="Comptes Obligatoires Manquants" size="small" type="inner">
              <Alert
                message={`${compliance.details.missingAccounts.length} compte(s) obligatoire(s) manquant(s)`}
                type="error"
                showIcon
              />
              <div style={{ marginTop: 8 }}>
                {compliance.details.missingAccounts.map(code => (
                  <Tag key={code} color="red" style={{ margin: '2px' }}>
                    {code} - {namingConventions[code as keyof typeof namingConventions]}
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Erreurs de structure */}
          {compliance.details.structureErrors.length > 0 && (
            <Card title="Erreurs de Structure" size="small" type="inner">
              <List
                size="small"
                dataSource={compliance.details.structureErrors}
                renderItem={(error, index) => (
                  <List.Item>
                    <Space>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      {error}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Avertissements de nommage */}
          {compliance.details.namingWarnings.length > 0 && (
            <Card title="Avertissements de Nommage" size="small" type="inner">
              <List
                size="small"
                dataSource={compliance.details.namingWarnings}
                renderItem={(warning, index) => (
                  <List.Item>
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      {warning}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default SYSCOHADAValidator;