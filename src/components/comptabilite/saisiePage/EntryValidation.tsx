import React from 'react';
import { Card, Alert, List, Tag, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EntryValidationResult } from '../../../types';

interface EntryValidationProps {
  validationResult: EntryValidationResult;
  showDetails?: boolean;
}

const EntryValidation: React.FC<EntryValidationProps> = ({ 
  validationResult, 
  showDetails = true 
}) => {
  const { isValid, errors, warnings, balanceCheck, periodCheck, accountChecks } = validationResult;

  return (
    <Card 
      title="Validation de l'écriture" 
      size="small"
      style={{ marginBottom: 16 }}
    >
      {/* Statut global */}
      <Alert
        message={isValid ? "Écriture valide" : "Écriture invalide"}
        description={isValid ? 
          "L'écriture respecte toutes les règles de validation." : 
          "Des erreurs doivent être corrigées avant validation."
        }
        type={isValid ? "success" : "error"}
        showIcon
        icon={isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      {/* Détails de validation */}
      {showDetails && (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Équilibre */}
          <div>
            <strong>Équilibre débit/crédit:</strong>
            <Tag 
              color={balanceCheck.isBalanced ? "green" : "red"} 
              style={{ marginLeft: 8 }}
            >
              {balanceCheck.isBalanced ? "Équilibré" : "Déséquilibré"}
            </Tag>
            {!balanceCheck.isBalanced && (
              <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: 4 }}>
                Différence: {balanceCheck.difference.toFixed(2)} FCFA
              </div>
            )}
          </div>

          {/* Période */}
          <div>
            <strong>Période comptable:</strong>
            <Tag 
              color={periodCheck.isOpen ? "blue" : "red"} 
              style={{ marginLeft: 8 }}
            >
              {periodCheck.isOpen ? "Période ouverte" : "Période fermée"}
            </Tag>
          </div>

          {/* Comptes */}
          <div>
            <strong>Validation des comptes:</strong>
            <Space size="small" style={{ marginLeft: 8 }}>
              <Tag color={accountChecks.validAccounts ? "green" : "red"}>
                Comptes valides
              </Tag>
              <Tag color={accountChecks.activeAccounts ? "green" : "red"}>
                Comptes actifs
              </Tag>
              <Tag color={accountChecks.SYSCOHADACompliant ? "green" : "orange"}>
                SYSCOHADA
              </Tag>
            </Space>
          </div>

          {/* Erreurs */}
          {errors.length > 0 && (
            <div>
              <strong>Erreurs:</strong>
              <List
                size="small"
                dataSource={errors}
                renderItem={(error, index) => (
                  <List.Item>
                    <Space>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      <span>{error}</span>
                    </Space>
                  </List.Item>
                )}
                style={{ marginTop: 8 }}
              />
            </div>
          )}

          {/* Avertissements */}
          {warnings.length > 0 && (
            <div>
              <strong>Avertissements:</strong>
              <List
                size="small"
                dataSource={warnings}
                renderItem={(warning, index) => (
                  <List.Item>
                    <Space>
                      <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                      <span>{warning}</span>
                    </Space>
                  </List.Item>
                )}
                style={{ marginTop: 8 }}
              />
            </div>
          )}
        </Space>
      )}

      {/* Résumé pour les petits espaces */}
      {!showDetails && (
        <Space>
          <Tag color={isValid ? "green" : "red"}>
            {isValid ? "Valide" : `${errors.length} erreur(s)`}
          </Tag>
          {warnings.length > 0 && (
            <Tag color="orange">
              {warnings.length} avertissement(s)
            </Tag>
          )}
        </Space>
      )}
    </Card>
  );
};

export default EntryValidation;