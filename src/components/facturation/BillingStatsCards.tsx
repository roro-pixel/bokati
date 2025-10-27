import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { motion } from 'framer-motion';
import { 
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { BillingStats } from '../../types/index';

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

interface BillingStatsCardsProps {
  stats: BillingStats;
  onStatClick?: (statType: string) => void;
}

const BillingStatsCards: React.FC<BillingStatsCardsProps> = ({ stats, onStatClick }) => {
  const statsConfig = [
    {
      key: 'invoices',
      title: 'Factures ce mois',
      value: stats.invoicesThisMonth,
      icon: <FileTextOutlined />,
      color: '#1890ff',
      suffix: `/ ${stats.totalInvoices} total`,
      onClick: () => onStatClick?.('invoices')
    },
    {
      key: 'revenue',
      title: 'Chiffre affaire',
      value: stats.revenueThisMonth,
      icon: <DollarOutlined />,
      color: '#52c41a',
      prefix: 'FCFA ',
      suffix: `Total: ${stats.totalRevenue.toLocaleString()} FCFA`,
      onClick: () => onStatClick?.('revenue')
    },
    {
      key: 'outstanding',
      title: 'Encaissements dus',
      value: stats.outstandingAmount,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
      prefix: 'FCFA ',
      suffix: `Dont ${stats.overdueAmount.toLocaleString()} FCFA en retard`,
      onClick: () => onStatClick?.('outstanding')
    },
    {
      key: 'payment-rate',
      title: 'Taux encaissement',
      value: stats.paymentRate,
      icon: <CheckCircleOutlined />,
      color: '#722ed1',
      suffix: '%',
      onClick: () => onStatClick?.('payment-rate')
    },
    {
      key: 'payment-time',
      title: 'Délai moyen',
      value: stats.averagePaymentTime,
      icon: <ClockCircleOutlined />,
      color: '#13c2c2',
      suffix: 'jours',
      onClick: () => onStatClick?.('payment-time')
    },
    {
      key: 'aging',
      title: 'Créances > 90j',
      value: stats.agingReceivables.over90,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      prefix: 'FCFA ',
      suffix: 'à recouvrer',
      onClick: () => onStatClick?.('aging')
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
              {stat.key === 'payment-rate' && (
                <Progress 
                  percent={stats.paymentRate} 
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

export default BillingStatsCards;