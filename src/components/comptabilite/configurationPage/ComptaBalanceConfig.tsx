import React, { useState } from 'react';
import { Card, Row, Col, Form, Switch, InputNumber, Button, Alert, Divider, Tag, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { 
  SaveOutlined, 
  ReloadOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import { useBalanceConfiguration } from '../../../hooks/comptabilite/module_three/useBalanceConfiguration';

export const ComptaBalanceConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  
  const {
    configuration,
    loading,
    error,
    updateConfiguration,
    resetToDefault,
    validateConfiguration
  } = useBalanceConfiguration();

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      await updateConfiguration({
        includeDraftEntries: values.includeDraftEntries,
        includeReversedEntries: values.includeReversedEntries,
        groupByAuxiliary: values.groupByAuxiliary,
        showZeroBalance: values.showZeroBalance,
        roundToNearest: values.roundToNearest,
        validationRules: {
          maxDifference: values.maxDifference,
          allowUnbalanced: values.allowUnbalanced,
          strictSYSCOHADA: values.strictSYSCOHADA
        },
        reportSettings: {
          includeOpeningBalance: values.includeOpeningBalance,
          includePeriodMovement: values.includePeriodMovement,
          includeClosingBalance: values.includeClosingBalance,
          showComparative: values.showComparative
        }
      });
      
      // Validation après sauvegarde
      const validation = validateConfiguration({
        ...configuration,
        ...values
      });
      
      if (validation.isValid) {
        Alert.success('Configuration sauvegardée avec succès!');
      } else {
        Alert.warning('Configuration sauvegardée avec des avertissements');
      }
      
    } catch (err) {
      Alert.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefault();
      form.resetFields();
      Alert.success('Configuration réinitialisée aux valeurs par défaut');
    } catch (err) {
      Alert.error('Erreur lors de la réinitialisation');
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
            <CalculatorOutlined />
            Configuration de la Balance Comptable
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
              loading={loading}
            >
              Réinitialiser
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={saving || loading}
            >
              Sauvegarder
            </Button>
          </div>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            includeDraftEntries: configuration.includeDraftEntries,
            includeReversedEntries: configuration.includeReversedEntries,
            groupByAuxiliary: configuration.groupByAuxiliary,
            showZeroBalance: configuration.showZeroBalance,
            roundToNearest: configuration.roundToNearest,
            maxDifference: configuration.validationRules.maxDifference,
            allowUnbalanced: configuration.validationRules.allowUnbalanced,
            strictSYSCOHADA: configuration.validationRules.strictSYSCOHADA,
            includeOpeningBalance: configuration.reportSettings.includeOpeningBalance,
            includePeriodMovement: configuration.reportSettings.includePeriodMovement,
            includeClosingBalance: configuration.reportSettings.includeClosingBalance,
            showComparative: configuration.reportSettings.showComparative
          }}
        >
          <Row gutter={24}>
            {/* Colonne 1 : Filtres et Options */}
            <Col span={12}>
              <Card title="Filtres et Options d'Affichage" size="small" style={{ marginBottom: 16 }}>
                <Form.Item
                  name="includeDraftEntries"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Inclure les écritures brouillons</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Afficher les écritures non validées dans la balance
                  </div>
                </Form.Item>

                <Form.Item
                  name="includeReversedEntries"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Inclure les écritures contre-passées</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Afficher les écritures d'annulation
                  </div>
                </Form.Item>

                <Form.Item
                  name="groupByAuxiliary"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Grouper par comptes auxiliaires</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Regrouper les soldes par clients/fournisseurs
                  </div>
                </Form.Item>

                <Form.Item
                  name="showZeroBalance"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Afficher les soldes nuls</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Montrer les comptes avec solde zéro
                  </div>
                </Form.Item>
              </Card>

              <Card title="Paramètres du Rapport" size="small">
                <Form.Item
                  name="includeOpeningBalance"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Solde d'ouverture</span>
                </Form.Item>

                <Form.Item
                  name="includePeriodMovement"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Mouvement de période</span>
                </Form.Item>

                <Form.Item
                  name="includeClosingBalance"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Solde de clôture</span>
                </Form.Item>

                <Form.Item
                  name="showComparative"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Affichage comparatif</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Comparer avec la période précédente
                  </div>
                </Form.Item>
              </Card>
            </Col>

            {/* Colonne 2 : Validation et Calculs */}
            <Col span={12}>
              <Card title="Règles de Validation" size="small" style={{ marginBottom: 16 }}>
                <Form.Item
                  name="strictSYSCOHADA"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Validation SYSCOHADA stricte</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Appliquer strictement les règles du plan comptable
                  </div>
                </Form.Item>

                <Form.Item
                  name="allowUnbalanced"
                  label=" "
                  valuePropName="checked"
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Autoriser balance déséquilibrée</span>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                    Permettre un léger déséquilibre (pour ajustements)
                  </div>
                </Form.Item>

                <Form.Item
                  name="maxDifference"
                  label="Différence maximale autorisée (FCFA)"
                  tooltip="Écart maximum accepté entre total débit et crédit"
                >
                  <InputNumber
                    min={0}
                    max={1000}
                    step={0.01}
                    precision={2}
                    style={{ width: '100%' }}
                    addonAfter="FCFA"
                  />
                </Form.Item>

                <Form.Item
                  name="roundToNearest"
                  label="Arrondi des montants"
                  tooltip="Arrondir les montants à l'unité la plus proche"
                >
                  <InputNumber
                    min={1}
                    max={1000}
                    step={1}
                    style={{ width: '100%' }}
                    addonAfter="FCFA"
                  />
                </Form.Item>
              </Card>

              {/* Résumé de la configuration */}
              <Card title="Résumé de la Configuration" size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Précision"
                      value={configuration.roundToNearest}
                      suffix="FCFA"
                      valueStyle={{ fontSize: '16px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Tolérance"
                      value={configuration.validationRules.maxDifference}
                      suffix="FCFA"
                      valueStyle={{ fontSize: '16px' }}
                    />
                  </Col>
                </Row>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <div style={{ marginBottom: 4 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                    {configuration.validationRules.strictSYSCOHADA ? 'Validation SYSCOHADA active' : 'Validation SYSCOHADA désactivée'}
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                    {configuration.groupByAuxiliary ? 'Groupement par auxiliaires activé' : 'Groupement par auxiliaires désactivé'}
                  </div>
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                    {configuration.showZeroBalance ? 'Soldes nuls affichés' : 'Soldes nuls masqués'}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>

        {/* Indicateurs de statut */}
        <Divider />
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Tag color="green" style={{ fontSize: '12px', marginBottom: 8 }}>
                  Configuration Active
                </Tag>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Paramètres appliqués aux prochaines balances
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Tag color="blue" style={{ fontSize: '12px', marginBottom: 8 }}>
                  {configuration.validationRules.strictSYSCOHADA ? 'Mode Strict' : 'Mode Flexible'}
                </Tag>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {configuration.validationRules.strictSYSCOHADA ? 'Validation SYSCOHADA stricte' : 'Validation assouplie'}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Tag color="orange" style={{ fontSize: '12px', marginBottom: 8 }}>
                  Tolérance: {configuration.validationRules.maxDifference} FCFA
                </Tag>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Écart maximum accepté
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
};

export default ComptaBalanceConfig;