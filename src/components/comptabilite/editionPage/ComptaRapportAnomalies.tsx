import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, DatePicker, Table, Tag, Statistic, Alert, Form, Select } from 'antd';
import { motion } from 'framer-motion';
import { 
  FilePdfOutlined, 
  FileExcelOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExceptionOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useAnomalyReports } from '../../../hooks/comptabilite/module_five/useAnomalyReports';
import { AnomalyReport, ReportFilter } from '../../../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const ComptaRapportAnomalies: React.FC = () => {
  const [form] = Form.useForm();
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [filter, setFilter] = useState<Partial<ReportFilter>>({
    includePostedOnly: false
  });
  
  const { loading, error, getAnomalies, resolveAnomaly, getAnomalyStats, exportAnomalyReport } = useAnomalyReports();

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async (customFilter?: Partial<ReportFilter>) => {
    try {
      const currentFilter = customFilter || filter;
      const result = await getAnomalies({
        periodId: 'current',
        includePostedOnly: currentFilter.includePostedOnly || false,
        includeDraft: false,
        ...currentFilter
      } as ReportFilter);
      setAnomalies(result);
    } catch (err) {
      console.error('Erreur chargement anomalies:', err);
    }
  };

  const handleFilterChange = (values: any) => {
    const newFilter = {
      ...filter,
      startDate: values.dateRange?.[0],
      endDate: values.dateRange?.[1],
      includePostedOnly: values.resolvedOnly || false
    };
    setFilter(newFilter);
    loadAnomalies(newFilter);
  };

  const handleResolveAnomaly = async (anomalyId: string) => {
    try {
      await resolveAnomaly(anomalyId, 'current-user');
      // Recharger la liste
      await loadAnomalies();
      alert('Anomalie marquée comme résolue!');
    } catch (err) {
      console.error('Erreur résolution anomalie:', err);
    }
  };

  const handleExportPDF = async () => {
    await exportAnomalyReport(anomalies, 'PDF');
  };

  const handleExportExcel = async () => {
    await exportAnomalyReport(anomalies, 'EXCEL');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#cf1322';
      case 'HIGH': return '#ff4d4f';
      case 'MEDIUM': return '#faad14';
      case 'LOW': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <CloseCircleOutlined />;
      case 'HIGH': return <WarningOutlined />;
      case 'MEDIUM': return <InfoCircleOutlined />;
      case 'LOW': return <CheckCircleOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'UNBALANCED_ENTRY': return 'red';
      case 'SUSPENSE_ACCOUNT': return 'orange';
      case 'INACTIVE_ACCOUNT': return 'blue';
      case 'PERIOD_CLOSED': return 'purple';
      case 'VALIDATION_ERROR': return 'cyan';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'UNBALANCED_ENTRY': return 'Écriture Déséquilibrée';
      case 'SUSPENSE_ACCOUNT': return 'Compte d\'Attente';
      case 'INACTIVE_ACCOUNT': return 'Compte Inactif';
      case 'PERIOD_CLOSED': return 'Période Clôturée';
      case 'VALIDATION_ERROR': return 'Erreur Validation';
      default: return type;
    }
  };

  const columns = [
    {
      title: 'Sévérité',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => (
        <Tag 
          color={getSeverityColor(severity)} 
          icon={getSeverityIcon(severity)}
          style={{ fontWeight: 'bold' }}
        >
          {severity}
        </Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {getTypeText(type)}
        </Tag>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Détails',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true
    },
    {
      title: 'Détecté le',
      dataIndex: 'detectedAt',
      key: 'detectedAt',
      width: 120,
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Statut',
      dataIndex: 'resolved',
      key: 'resolved',
      width: 100,
      render: (resolved: boolean, record: AnomalyReport) => (
        <Tag color={resolved ? 'green' : 'red'}>
          {resolved ? 'Résolue' : 'En cours'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: AnomalyReport) => (
        !record.resolved ? (
          <Button 
            size="small" 
            type="primary"
            onClick={() => handleResolveAnomaly(record.id)}
          >
            Marquer Résolue
          </Button>
        ) : (
          <Tag color="green">Résolue</Tag>
        )
      )
    }
  ];

  const stats = getAnomalyStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExceptionOutlined />
            Rapport d'Anomalies Comptables
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={handleExportPDF}
              disabled={anomalies.length === 0 || loading}
            >
              PDF
            </Button>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={handleExportExcel}
              disabled={anomalies.length === 0 || loading}
            >
              Excel
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
                title="Total Anomalies"
                value={stats.total}
                prefix={<ExceptionOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Résolues"
                value={stats.resolved}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Critiques"
                value={stats.critical}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Élevées"
                value={stats.high}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filtres */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFilterChange}
            initialValues={{
              resolvedOnly: false
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="dateRange" label="Période de détection">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="resolvedOnly" label="Statut">
                  <Select placeholder="Toutes les anomalies">
                    <Option value={false}>Anomalies en cours</Option>
                    <Option value={true}>Anomalies résolues</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label=" ">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<ReloadOutlined />}
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    Actualiser
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Liste des anomalies */}
        <Card title="Anomalies Détectées" size="small">
          <Table
            columns={columns}
            dataSource={anomalies}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="small"
            scroll={{ y: 400 }}
            loading={loading}
          />
        </Card>

        {anomalies.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <CheckCircleOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
            <div>Aucune anomalie détectée pour les critères sélectionnés</div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ComptaRapportAnomalies;