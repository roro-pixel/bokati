import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { motion } from 'framer-motion';
import { 
  TeamOutlined, 
  UserOutlined, 
  DollarOutlined, 
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { PartnerStats } from '../../types/index';

const AnimatedCard = ({ children, onClick }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 300 }}
    onClick={onClick}
  >
    <Card hoverable style={{ height: '100%' }}>
      {children}
    </Card>
  </motion.div>
);

interface PartnerStatsCardsProps {
  stats: PartnerStats;
  onStatClick?: (statType: string) => void;
}

const PartnerStatsCards: React.FC<PartnerStatsCardsProps> = ({ stats, onStatClick }) => {
  const statsConfig = [
    {
      key: 'clients',
      title: 'Total Clients',
      value: stats.totalClients,
      icon: <UserOutlined />,
      color: '#1890ff',
      suffix: `/ ${stats.clientsActifs} actifs`,
      onClick: () => onStatClick?.('clients')
    },
    {
      key: 'fournisseurs',
      title: 'Total Fournisseurs',
      value: stats.totalFournisseurs,
      icon: <TeamOutlined />,
      color: '#52c41a',
      suffix: `/ ${stats.fournisseursActifs} actifs`,
      onClick: () => onStatClick?.('fournisseurs')
    },
    {
      key: 'creances',
      title: 'Créances Clients',
      value: stats.totalCreances,
      icon: <ArrowUpOutlined />,
      color: '#fa541c',
      prefix: 'FCFA ',
      suffix: `Moy: ${stats.creanceMoyenne.toLocaleString()} FCFA`,
      onClick: () => onStatClick?.('creances')
    },
    {
      key: 'dettes',
      title: 'Dettes Fournisseurs',
      value: stats.totalDettes,
      icon: <ArrowDownOutlined />,
      color: '#722ed1',
      prefix: 'FCFA ',
      suffix: `Moy: ${stats.detteMoyenne.toLocaleString()} FCFA`,
      onClick: () => onStatClick?.('dettes')
    },
    {
      key: 'retards',
      title: 'Retards de Paiement',
      value: stats.clientsEnRetard + stats.fournisseursEnRetard,
      icon: <WarningOutlined />,
      color: '#faad14',
      suffix: `${stats.clientsEnRetard} clients, ${stats.fournisseursEnRetard} fourn.`,
      onClick: () => onStatClick?.('retards')
    },
    {
      key: 'risque',
      title: 'Risque Élevé',
      value: stats.risqueEleve,
      icon: <DollarOutlined />,
      color: '#ff4d4f',
      suffix: 'Partenaires',
      onClick: () => onStatClick?.('risque')
    }
  ];

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      {statsConfig.map((stat, index) => (
        <Col xs={24} sm={12} lg={8} xl={4} key={stat.key}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AnimatedCard onClick={stat.onClick}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
              {stat.key === 'risque' && (
                <Progress 
                  percent={(stats.risqueEleve / stats.totalClients) * 100} 
                  size="small" 
                  strokeColor={stat.color}
                  style={{ marginTop: 8 }}
                />
              )}
            </AnimatedCard>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
};

export default PartnerStatsCards;