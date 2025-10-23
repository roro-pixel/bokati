import React, { useState } from 'react';
import { Card, Tabs, Button, Space } from 'antd';
import { motion } from 'framer-motion';
import { 
  CalendarOutlined,
  // PlayCircleOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  SettingOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FiscalYear from '../../components/comptabilite/periodePage/FiscalYearSetup';
import PeriodManagement from '../../components/comptabilite/periodePage/PeriodManagement';
import PeriodClosing from '../../components/comptabilite/periodePage/PeriodClosing';
import YearEndProcess from '../../components/comptabilite/periodePage/YearEndProcess';

const { TabPane } = Tabs;

const ComptaPeriodPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gestion');

  const tabItems = [
    {
      key: 'exercices',
      label: (
        <span>
          <CalendarOutlined />
          Exercices
        </span>
      ),
      children: <FiscalYear />
    },
    {
      key: 'gestion',
      label: (
        <span>
          <SettingOutlined />
          Gestion des Périodes
        </span>
      ),
      children: <PeriodManagement />
    },
    {
      key: 'cloture',
      label: (
        <span>
          <LockOutlined />
          Clôture de Période
        </span>
      ),
      children: <PeriodClosing />
    },
    {
      key: 'fin-exercice',
      label: (
        <span>
          <FileTextOutlined />
          Fin d'Exercice
        </span>
      ),
      children: <YearEndProcess />
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
              <span>Module de Gestion des Périodes</span>
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

export default ComptaPeriodPage;