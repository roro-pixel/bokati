// src/pages/comptabilite/ComptaComptesPages.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Space, 
  Button,
  message 
} from 'antd';
import { 
  TableOutlined, 
  UserOutlined, 
  FileSearchOutlined,
  PlusOutlined,
  ImportOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ChartAccount } from '../../types';
import { useChartOfAccounts } from '../../hooks/comptabilite/module_three/useChartOfAccounts';

// Composants du Module 3
import ComptaPlanComptable from '../../components/comptabilite/comptesPage/ComptaPlanComptable';
import ComptaListeComptesTiers from '../../components/comptabilite/comptesPage/ComptaListeComptesTiers';
import SYSCOHADAValidator from '../../components/comptabilite/comptesPage/SYSCOHADAValidator';
import ComptaCreerCompte from '../../components/comptabilite/comptesPage/ComptaCreerCompte';
import ComptaImporterComptes from '../../components/comptabilite/comptesPage/ComptaImporterComptes';

const { TabPane } = Tabs;

const ComptaComptesPages: React.FC = () => {
  const navigate = useNavigate(); // ✅ Ajouter cette ligne
  const [activeTab, setActiveTab] = useState('plan-comptable');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartAccount>();
  const [parentAccount, setParentAccount] = useState<ChartAccount>();

  const { accounts, refetch } = useChartOfAccounts();

  const handleEditAccount = (account: ChartAccount) => {
    setSelectedAccount(account);
    setCreateModalVisible(true);
  };

  const handleAddAccount = (parent?: ChartAccount) => {
    setParentAccount(parent);
    setSelectedAccount(undefined);
    setCreateModalVisible(true);
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    setSelectedAccount(undefined);
    setParentAccount(undefined);
    refetch();
    message.success('Compte enregistré avec succès');
  };

  const handleImportSuccess = () => {
    setImportModalVisible(false);
    refetch();
    message.success('Importation terminée avec succès');
  };

  const tabItems = [
    {
      key: 'plan-comptable',
      label: (
        <Space>
          <TableOutlined />
          Plan Comptable
        </Space>
      ),
      children: (
        <ComptaPlanComptable
          onEditAccount={handleEditAccount}
          onAddAccount={handleAddAccount}
        />
      )
    },
    {
      key: 'comptes-tiers',
      label: (
        <Space>
          <UserOutlined />
          Comptes de Tiers
        </Space>
      ),
      children: (
        <ComptaListeComptesTiers
          accounts={accounts}
          onEditAccount={handleEditAccount}
          onAddAccount={() => handleAddAccount()}
        />
      )
    },
    {
      key: 'validation',
      label: (
        <Space>
          <FileSearchOutlined />
          Validation SYSCOHADA
        </Space>
      ),
      children: (
        <SYSCOHADAValidator accounts={accounts} />
      )
    }
  ];

  return (
    <div>
      <Card 
        title={
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/comptabilite')}
                type="text"
              />
              <span>Gestion plan Comptable</span>
            </Space>
          }
        extra={
          <Space>
            <Button 
              icon={<ImportOutlined />}
              onClick={() => setImportModalVisible(true)}
            >
              Importer
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => handleAddAccount()}
            >
              Nouveau Compte
            </Button>
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>

      {/* Modal de création/édition */}
      <ComptaCreerCompte
        open={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          setSelectedAccount(undefined);
          setParentAccount(undefined);
        }}
        onSuccess={handleCreateSuccess}
        parentAccount={parentAccount}
        editAccount={selectedAccount}
      />

      {/* Modal d'importation */}
      <ComptaImporterComptes
        open={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default ComptaComptesPages;