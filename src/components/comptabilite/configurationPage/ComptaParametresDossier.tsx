import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Button, Select, DatePicker, Switch, Alert, Divider, Tag, Descriptions } from 'antd';
import { motion } from 'framer-motion';
import { 
  SaveOutlined,
  DatabaseOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export const ComptaParametresDossier: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [currentSettings, setCurrentSettings] = useState({
    // Paramètres généraux
    companyName: 'ENTREPRISE ABC SARL',
    currency: 'XAF',
    accountingSystem: 'Normal',
    fiscalYearStart: '2024-01-01',
    
    // Paramètres SYSCOHADA
    syscohadaVersion: '2024',
    strictValidation: true,
    autoAccountCreation: false,
    
    // Paramètres de saisie
    defaultJournal: 'GEN',
    requireEntryDescription: true,
    autoEntryNumbering: true,
    maxEntryLines: 10,
    
    // Paramètres de validation
    approvalRequired: true,
    approvalLevel: 2,
    maxAmountWithoutApproval: 500000,
    
    // Paramètres d'export
    defaultExportFormat: 'PDF',
    includeDetailsInExport: true,
    compressExports: false
  });

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      // Simulation sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentSettings({ ...currentSettings, ...values });
      Alert.success('Paramètres sauvegardés avec succès!');
    } catch (err) {
      Alert.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
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
            <DatabaseOutlined />
            Paramètres du Dossier Comptable
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={saving}
          >
            Sauvegarder
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={currentSettings}
        >
          {/* Section 1: Informations Générales */}
          <Card title="Informations Générales" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyName"
                  label="Nom de l'Entreprise"
                  rules={[{ required: true, message: 'Le nom est requis' }]}
                >
                  <Input placeholder="Nom de l'entreprise" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="currency"
                  label="Devise Comptable"
                  rules={[{ required: true, message: 'La devise est requise' }]}
                >
                  <Select>
                    <Option value="XAF">FCFA (XAF)</Option>
                    <Option value="EUR">Euro (EUR)</Option>
                    <Option value="USD">Dollar USD</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="accountingSystem"
                  label="Système Comptable"
                >
                  <Select>
                    <Option value="Normal">Système Normal</Option>
                    <Option value="SMT">Système Minimal</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fiscalYearStart"
                  label="Début d'Exercice Fiscal"
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    picker="year" 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="syscohadaVersion"
                  label="Version SYSCOHADA"
                >
                  <Select>
                    <Option value="2024">SYSCOHADA 2024</Option>
                    <Option value="2018">SYSCOHADA 2018</Option>
                    <Option value="2010">SYSCOHADA 2010</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Section 2: Paramètres SYSCOHADA */}
          <Card title="Paramètres SYSCOHADA" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="strictValidation"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Validation stricte SYSCOHADA</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Appliquer strictement les règles du plan comptable
                  </div>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="autoAccountCreation"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Création automatique comptes</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Créer automatiquement les comptes manquants
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Section 3: Paramètres de Saisie */}
          <Card title="Paramètres de Saisie" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="defaultJournal"
                  label="Journal par Défaut"
                >
                  <Select>
                    <Option value="GEN">GEN - Général</Option>
                    <Option value="VTE">VTE - Ventes</Option>
                    <Option value="ACH">ACH - Achats</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="maxEntryLines"
                  label="Lignes max par écriture"
                >
                  <Select>
                    <Option value={5}>5 lignes</Option>
                    <Option value={10}>10 lignes</Option>
                    <Option value={20}>20 lignes</Option>
                    <Option value={50}>50 lignes</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="maxAmountWithoutApproval"
                  label="Seuil sans approbation"
                >
                  <Input addonAfter="FCFA" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="requireEntryDescription"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Description obligatoire</span>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="autoEntryNumbering"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Numérotation automatique</span>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="approvalRequired"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Approbation requise</span>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Section 4: Paramètres d'Export */}
          <Card title="Paramètres d'Export et Rapports" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="defaultExportFormat"
                  label="Format d'export par défaut"
                >
                  <Select>
                    <Option value="PDF">PDF</Option>
                    <Option value="EXCEL">Excel</Option>
                    <Option value="CSV">CSV</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="includeDetailsInExport"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Inclure détails dans exports</span>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="compressExports"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Compresser les exports</span>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>

        <Divider />

        {/* Résumé des paramètres */}
        <Card title="Résumé des Paramètres Actuels" size="small">
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Entreprise">
              {currentSettings.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="Devise">
              <Tag color="blue">{currentSettings.currency}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Système Comptable">
              {currentSettings.accountingSystem}
            </Descriptions.Item>
            <Descriptions.Item label="Version SYSCOHADA">
              <Tag color="green">{currentSettings.syscohadaVersion}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Validation SYSCOHADA">
              <Tag color={currentSettings.strictValidation ? 'green' : 'orange'}>
                {currentSettings.strictValidation ? 'Stricte' : 'Flexible'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Journal par Défaut">
              {currentSettings.defaultJournal}
            </Descriptions.Item>
            <Descriptions.Item label="Approbation Requise">
              <Tag color={currentSettings.approvalRequired ? 'green' : 'red'}>
                {currentSettings.approvalRequired ? 'Oui' : 'Non'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Seuil Auto-approbation">
              {currentSettings.maxAmountWithoutApproval.toLocaleString()} FCFA
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </motion.div>
  );
};

export default ComptaParametresDossier;