import React, { useState } from 'react';
import { Card, Tabs, Button, Space } from 'antd';
import { motion } from 'framer-motion';
import { 
  BookOutlined,
  CalculatorOutlined,
  LockOutlined,
  DatabaseOutlined,
  TeamOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ComptaConfigComptes from '../../components/comptabilite/configurationPage/ComptaConfigComptes';
import ComptaConfigJournaux from '../../components/comptabilite/configurationPage/ComptaConfigJournaux';
import ComptaBalanceConfig from '../../components/comptabilite/configurationPage/ComptaBalanceConfig';
import ComptaClotureBalance from '../../components/comptabilite/configurationPage/ComptaClotureBalance';
import ComptaAutorisations from '../../components/comptabilite/configurationPage/ComptaAutorisations';
import ComptaParametresDossier from '../../components/comptabilite/configurationPage/ComptaParametresDossier';

const { TabPane } = Tabs;

const ComptaConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plan-comptable');

  const tabItems = [
    {
      key: 'plan-comptable',
      label: (
        <span>
          <BookOutlined />
          Plan Comptable
        </span>
      ),
      children: <ComptaConfigComptes />
    },
    {
      key: 'journaux',
      label: (
        <span>
          <BookOutlined />
          Journaux
        </span>
      ),
      children: <ComptaConfigJournaux />
    },
    {
      key: 'balance',
      label: (
        <span>
          <CalculatorOutlined />
          Configuration Balance
        </span>
      ),
      children: <ComptaBalanceConfig />
    },
    {
      key: 'cloture',
      label: (
        <span>
          <LockOutlined />
          Clôture Balance
        </span>
      ),
      children: <ComptaClotureBalance />
    },
    {
      key: 'autorisations',
      label: (
        <span>
          <TeamOutlined />
          Autorisations
        </span>
      ),
      children: <ComptaAutorisations />
    },
    {
      key: 'parametres',
      label: (
        <span>
          <DatabaseOutlined />
          Paramètres Dossier
        </span>
      ),
      children: <ComptaParametresDossier />
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
          <span>Module de Configuration Comptable</span>
          </Space>
       }
      >
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

export default ComptaConfigPage;