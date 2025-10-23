import React, { useState } from 'react';
import { Card, Tabs, Button, Space, Alert } from 'antd';
import { motion } from 'framer-motion';
import { 
  UploadOutlined,
  SyncOutlined,
  ReloadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ComptaImportations from '../../components/comptabilite/parametresAvancesPage/ComptaImportations';
import ComptaRapprocheBancaire from '../../components/comptabilite/parametresAvancesPage/ComptaRapprocheBancaire';
import ComptaRegenererPeriode from '../../components/comptabilite/parametresAvancesPage/ComptaRegenererPeriode';

const { TabPane } = Tabs;

const ComptaParametresAvances: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('importations');

  const tabItems = [
    {
      key: 'importations',
      label: (
        <span>
          <UploadOutlined />
          Importations
        </span>
      ),
      children: <ComptaImportations />
    },
    {
      key: 'rapprochement',
      label: (
        <span>
          <SyncOutlined />
          Rapprochement Bancaire
        </span>
      ),
      children: <ComptaRapprocheBancaire />
    },
    {
      key: 'regeneration',
      label: (
        <span>
          <ReloadOutlined />
          Régénération
        </span>
      ),
      children: <ComptaRegenererPeriode />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
          title={
            <Space>
              <Button 
               icon={<ArrowLeftOutlined />} 
               onClick={() => navigate('/comptabilite')}
               type="text"
              />
             <span>Paramètres Avancés Comptables</span>
           </Space>
       }
      >
        <Alert
          message="Zone d'opérations critiques"
          description="Ces fonctionnalités avancées peuvent modifier significativement les données comptables. Utilisez-les avec précaution."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={tabItems}
        />
      </Card>
    </motion.div>
  );
};

export default ComptaParametresAvances;