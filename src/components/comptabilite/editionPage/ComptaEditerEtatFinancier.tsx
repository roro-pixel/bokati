import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Alert, Spin } from 'antd';
import { motion } from 'framer-motion';
import { 
  FilePdfOutlined, 
  FileExcelOutlined, 
  ReloadOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useFinancialReports } from '../../../hooks/comptabilite/module_ten/useFinancialReports';
import { FinancialStatement } from '../../../types';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const ComptaEditerEtatFinancier: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024-06');
  const [reportType, setReportType] = useState<'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW'>('BALANCE_SHEET');
  const [generatedReport, setGeneratedReport] = useState<FinancialStatement | null>(null);
  
  const { 
    loading, 
    error, 
    generateBalanceSheet, 
    generateIncomeStatement, 
    generateCashFlow,
    exportToPDF, 
    exportToExcel 
  } = useFinancialReports();

  const handleGenerateReport = async () => {
    try {
      let report: FinancialStatement;
      
      switch (reportType) {
        case 'BALANCE_SHEET':
          report = await generateBalanceSheet(selectedPeriod);
          break;
        case 'INCOME_STATEMENT':
          report = await generateIncomeStatement(selectedPeriod);
          break;
        case 'CASH_FLOW':
          report = await generateCashFlow(selectedPeriod);
          break;
        default:
          return;
      }
      
      setGeneratedReport(report);
    } catch (err) {
      console.error('Erreur génération rapport:', err);
    }
  };

  const handleExportPDF = async () => {
    if (generatedReport) {
      await exportToPDF(generatedReport);
    }
  };

  const handleExportExcel = async () => {
    if (generatedReport) {
      await exportToExcel(generatedReport);
    }
  };

  const renderBalanceSheet = (data: any) => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="ACTIF" size="small" style={{ marginBottom: 16 }}>
          <Card type="inner" title="ACTIF IMMOBILISÉ">
            {Object.entries(data.actif.immobilise).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <strong>{Number(value).toLocaleString()} FCFA</strong>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #d9d9d9', marginTop: 8, paddingTop: 8, fontWeight: 'bold' }}>
              Total Actif Immobilisé: {(Object.values(data.actif.immobilise) as number[]).reduce((a, b) => a + b, 0).toLocaleString()} FCFA
            </div>
          </Card>
          
          <Card type="inner" title="ACTIF CIRCULANT" style={{ marginTop: 16 }}>
            {Object.entries(data.actif.circulant).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <strong>{Number(value).toLocaleString()} FCFA</strong>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #d9d9d9', marginTop: 8, paddingTop: 8, fontWeight: 'bold' }}>
              Total Actif Circulant: {(Object.values(data.actif.circulant) as number[]).reduce((a, b) => a + b, 0).toLocaleString()} FCFA
            </div>
          </Card>
        </Card>
      </Col>
      
      <Col span={12}>
        <Card title="PASSIF" size="small">
          <Card type="inner" title="RESSOURCES DURABLES">
            {Object.entries(data.passif.ressourcesDurables).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <strong>{Number(value).toLocaleString()} FCFA</strong>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #d9d9d9', marginTop: 8, paddingTop: 8, fontWeight: 'bold' }}>
              Total Ressources Durables: {(Object.values(data.passif.ressourcesDurables) as number[]).reduce((a, b) => a + b, 0).toLocaleString()} FCFA
            </div>
          </Card>
          
          <Card type="inner" title="PASSIF CIRCULANT" style={{ marginTop: 16 }}>
            {Object.entries(data.passif.circulant).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <strong>{Number(value).toLocaleString()} FCFA</strong>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #d9d9d9', marginTop: 8, paddingTop: 8, fontWeight: 'bold' }}>
              Total Passif Circulant: {(Object.values(data.passif.circulant) as number[]).reduce((a, b) => a + b, 0).toLocaleString()} FCFA
            </div>
          </Card>
        </Card>
      </Col>
    </Row>
  );

  const renderReportContent = () => {
    if (!generatedReport) return null;

    switch (generatedReport.type) {
      case 'BALANCE_SHEET':
        return renderBalanceSheet(generatedReport.data);
      case 'INCOME_STATEMENT':
        return (
          <Card title="COMPTE DE RÉSULTAT" size="small">
            <Alert 
              message="Compte de résultat généré avec succès" 
              type="success" 
              showIcon 
              style={{ marginBottom: 16 }}
            />
            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#1b5489ff' }}>
              Résultat Net: {(generatedReport.data as any).soldesIntermediaires.resultatNet.toLocaleString()} FCFA
            </div>
          </Card>
        );
      case 'CASH_FLOW':
        return (
          <Card title="TABLEAU DES FLUX DE TRÉSORERIE" size="small">
            <Alert 
              message="Tableau de flux généré avec succès" 
              type="info" 
              showIcon 
              style={{ marginBottom: 16 }}
            />
            <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: '#57a12cff' }}>
              Variation Trésorerie: {(generatedReport.data as any).variationTresorerie.toLocaleString()} FCFA
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarOutlined />
            Édition des États Financiers
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={handleExportPDF}
              disabled={!generatedReport || loading}
            >
              PDF
            </Button>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={handleExportExcel}
              disabled={!generatedReport || loading}
            >
              Excel
            </Button>
          </div>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        {/* Contrôles de génération */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Select 
                value={reportType} 
                onChange={setReportType}
                style={{ width: '100%' }}
              >
                <Option value="BALANCE_SHEET">Bilan</Option>
                <Option value="INCOME_STATEMENT">Compte de Résultat</Option>
                <Option value="CASH_FLOW">Flux de Trésorerie</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select 
                value={selectedPeriod} 
                onChange={setSelectedPeriod}
                style={{ width: '100%' }}
              >
                <Option value="2024-06">Juin 2024</Option>
                <Option value="2024-05">Mai 2024</Option>
                <Option value="2024-04">Avril 2024</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={handleGenerateReport}
                loading={loading}
                style={{ width: '100%' }}
              >
                Générer Rapport
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Affichage du rapport */}
        <Spin spinning={loading}>
          {renderReportContent()}
        </Spin>

        {!generatedReport && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <DollarOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
            <div>Sélectionnez un type de rapport et une période pour générer un état financier</div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ComptaEditerEtatFinancier;