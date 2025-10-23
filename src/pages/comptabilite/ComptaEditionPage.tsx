// src/pages/comptabilite/ComptaEditionPage.tsx
import React, { useState } from 'react';
import { Card, Tabs, Button, Space } from 'antd';
import { motion } from 'framer-motion';
import { 
  FileTextOutlined, 
  BarChartOutlined, 
  ExceptionOutlined,
  BookOutlined,
  // SettingOutlined
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ComptaEditerEtatFinancier from '../../components/comptabilite/editionPage/ComptaEditerEtatFinancier';
import ComptaEditerEtatComptable from '../../components/comptabilite/editionPage/ComptaEditerEtatComptable';
import ComptaLivreJournal from '../../components/comptabilite/editionPage/comptaLivreJournal'
import ComptaRapportAnomalies from '../../components/comptabilite/editionPage/ComptaRapportAnomalies';

const { TabPane } = Tabs;

const ComptaEditionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('etats-financiers');

  const tabItems = [
    {
      key: 'etats-financiers',
      label: (
        <span>
          <BarChartOutlined />
          États Financiers
        </span>
      ),
      children: <ComptaEditerEtatFinancier />
    },
    {
      key: 'etats-comptables',
      label: (
        <span>
          <FileTextOutlined />
          Grand Livre
        </span>
      ),
      children: <ComptaEditerEtatComptable />
    },
    {
      key: 'livre-journal',
      label: (
        <span>
          <BookOutlined />
          Livre Journal
        </span>
      ),
      children: <ComptaLivreJournal />
    },
    {
      key: 'anomalies',
      label: (
        <span>
          <ExceptionOutlined />
          Rapport d'Anomalies
        </span>
      ),
      children: <ComptaRapportAnomalies />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        // title={
        //   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        //     <SettingOutlined />
        //     Module d'Édition Comptable
        //   </div>
        // }
        title={
           <Space>
               <Button 
                 icon={<ArrowLeftOutlined />} 
                 onClick={() => navigate('/comptabilite')}
                 type="text"
                 />
          <span>Module d'Édition Comptable</span>
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

export default ComptaEditionPage;