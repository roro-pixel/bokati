import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { motion } from 'framer-motion';
import { 
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { SalesStats } from '../../types';

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

interface SalesStatsCardsProps {
  stats: SalesStats;
  onStatClick?: (statType: string) => void;
}

const SalesStatsCards: React.FC<SalesStatsCardsProps> = ({ stats, onStatClick }) => {
  const statsConfig = [
    {
      key: 'quotes',
      title: 'Devis ce mois',
      value: stats.quotesThisMonth,
      icon: <FileTextOutlined />,
      color: '#1890ff',
      suffix: `/ ${stats.totalQuotes} total`,
      onClick: () => onStatClick?.('quotes')
    },
    {
      key: 'orders',
      title: 'Commandes ce mois',
      value: stats.ordersThisMonth,
      icon: <ShoppingCartOutlined />,
      color: '#52c41a',
      suffix: `/ ${stats.totalOrders} total`,
      onClick: () => onStatClick?.('orders')
    },
    {
      key: 'revenue',
      title: 'Chiffre affaire',
      value: stats.revenueThisMonth,
      icon: <DollarOutlined />,
      color: '#fa541c',
      prefix: 'FCFA ',
      suffix: `Moy: ${stats.averageOrderValue.toLocaleString()} FCFA`,
      onClick: () => onStatClick?.('revenue')
    },
    {
      key: 'conversion',
      title: 'Taux conversion',
      value: stats.quoteConversionRate,
      icon: <RiseOutlined />,
      color: '#722ed1',
      suffix: '%',
      onClick: () => onStatClick?.('conversion')
    },
    {
      key: 'pending',
      title: 'En attente',
      value: stats.pendingOrders,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
      suffix: 'commandes',
      onClick: () => onStatClick?.('pending')
    },
    {
      key: 'customers',
      title: 'Top clients',
      value: stats.topCustomers.length,
      icon: <UserOutlined />,
      color: '#13c2c2',
      suffix: 'actifs',
      onClick: () => onStatClick?.('customers')
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
              {stat.key === 'conversion' && (
                <Progress 
                  percent={stats.quoteConversionRate} 
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

export default SalesStatsCards;