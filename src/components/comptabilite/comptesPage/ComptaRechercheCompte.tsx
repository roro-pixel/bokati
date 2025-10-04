import React, { useState } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Switch, 
  Space, 
  Tag, 
  Button,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined,
  ClearOutlined 
} from '@ant-design/icons';
import { ChartAccount, AccountClass, AccountType } from '../../../types';

const { Search } = Input;
const { Option } = Select;

interface ComptaRechercheCompteProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  resultCount?: number;
}

export interface SearchFilters {
  query: string;
  class?: AccountClass;
  type?: AccountType;
  isActive?: boolean;
  isAuxiliary?: boolean;
  isReconcilable?: boolean;
}

const ComptaRechercheCompte: React.FC<ComptaRechercheCompteProps> = ({
  onSearch,
  onClear,
  resultCount
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    isActive: true
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = { query: '', isActive: true };
    setFilters(clearedFilters);
    onClear();
  };

  const classOptions = [
    { value: '1', label: 'Classe 1 - Ressources durables' },
    { value: '2', label: 'Classe 2 - Actif immobilisé' },
    { value: '3', label: 'Classe 3 - Stocks' },
    { value: '4', label: 'Classe 4 - Tiers' },
    { value: '5', label: 'Classe 5 - Trésorerie' },
    { value: '6', label: 'Classe 6 - Charges' },
    { value: '7', label: 'Classe 7 - Produits' },
    { value: '8', label: 'Classe 8 - Autres' },
    { value: '9', label: 'Classe 9 - Analytique' }
  ];

  const typeOptions = [
    { value: 'ASSET', label: 'Actif' },
    { value: 'LIABILITY', label: 'Passif' },
    { value: 'EQUITY', label: 'Capitaux propres' },
    { value: 'INCOME', label: 'Produit' },
    { value: 'EXPENSE', label: 'Charge' }
  ];

  return (
    <Card 
      size="small" 
      title={
        <Space>
          <FilterOutlined />
          Recherche et Filtres
          {resultCount !== undefined && (
            <Tag color="blue">{resultCount} compte(s)</Tag>
          )}
        </Space>
      }
      extra={
        <Button 
          size="small" 
          icon={<ClearOutlined />} 
          onClick={handleClear}
        >
          Réinitialiser
        </Button>
      }
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Recherche texte */}
        <Search
          placeholder="Rechercher par code, nom ou description..."
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          allowClear
          style={{ width: '100%' }}
        />

        {/* Filtres avancés */}
        <Row gutter={[16, 8]} align="middle">
          <Col span={6}>
            <div style={{ fontSize: '12px', marginBottom: 4 }}>Classe:</div>
            <Select
              value={filters.class}
              onChange={(value) => handleFilterChange('class', value)}
              placeholder="Toutes classes"
              style={{ width: '100%' }}
              allowClear
            >
              {classOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={6}>
            <div style={{ fontSize: '12px', marginBottom: 4 }}>Type:</div>
            <Select
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              placeholder="Tous types"
              style={{ width: '100%' }}
              allowClear
            >
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={12}>
            <Space>
              <div style={{ fontSize: '12px' }}>Options:</div>
              <Switch
                checked={filters.isActive}
                onChange={(checked) => handleFilterChange('isActive', checked)}
                checkedChildren="Actifs"
                unCheckedChildren="Tous"
                size="small"
              />
              <Switch
                checked={filters.isAuxiliary}
                onChange={(checked) => handleFilterChange('isAuxiliary', checked)}
                checkedChildren="Auxiliaires"
                unCheckedChildren="Tous"
                size="small"
              />
              <Switch
                checked={filters.isReconcilable}
                onChange={(checked) => handleFilterChange('isReconcilable', checked)}
                checkedChildren="Rapprochables"
                unCheckedChildren="Tous"
                size="small"
              />
            </Space>
          </Col>
        </Row>

        {/* Filtres actifs */}
        <div>
          <Space wrap>
            {filters.query && (
              <Tag 
                closable 
                onClose={() => handleFilterChange('query', '')}
              >
                Recherche: "{filters.query}"
              </Tag>
            )}
            {filters.class && (
              <Tag 
                closable 
                onClose={() => handleFilterChange('class', undefined)}
              >
                Classe: {filters.class}
              </Tag>
            )}
            {filters.type && (
              <Tag 
                closable 
                onClose={() => handleFilterChange('type', undefined)}
              >
                Type: {
                  typeOptions.find(t => t.value === filters.type)?.label || filters.type
                }
              </Tag>
            )}
            {filters.isAuxiliary && (
              <Tag 
                closable 
                onClose={() => handleFilterChange('isAuxiliary', undefined)}
              >
                Auxiliaires seulement
              </Tag>
            )}
            {filters.isReconcilable && (
              <Tag 
                closable 
                onClose={() => handleFilterChange('isReconcilable', undefined)}
              >
                Rapprochables seulement
              </Tag>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default ComptaRechercheCompte;