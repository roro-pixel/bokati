import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { motion } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
  Tag
} from 'lucide-react';
import { ProductStats } from '../../types';

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

interface ProductStatsCardsProps {
  stats: ProductStats;
  onStatClick?: (statType: string) => void;
}

const ProductStatsCards: React.FC<ProductStatsCardsProps> = ({ stats, onStatClick }) => {
  const statsConfig = [
    {
      key: 'total',
      title: 'Total Produits',
      value: stats.totalProducts,
      icon: <Package size={20} />,
      color: '#1890ff',
      suffix: `/ ${stats.activeProducts} actifs`,
      onClick: () => onStatClick?.('total')
    },
    {
      key: 'stock',
      title: 'Valeur Stock',
      value: stats.totalStockValue,
      icon: <DollarSign size={20} />,
      color: '#52c41a',
      prefix: 'FCFA ',
      onClick: () => onStatClick?.('stock')
    },
    {
      key: 'out-of-stock',
      title: 'Rupture Stock',
      value: stats.outOfStock,
      icon: <AlertTriangle size={20} />,
      color: '#ff4d4f',
      suffix: 'produits',
      onClick: () => onStatClick?.('out-of-stock')
    },
    {
      key: 'low-stock',
      title: 'Stock Faible',
      value: stats.lowStock,
      icon: <TrendingUp size={20} />,
      color: '#faad14',
      suffix: 'produits',
      onClick: () => onStatClick?.('low-stock')
    },
    {
      key: 'average-cost',
      title: 'Coût Moyen',
      value: stats.averageCost,
      icon: <BarChart3 size={20} />,
      color: '#722ed1',
      prefix: 'FCFA ',
      onClick: () => onStatClick?.('average-cost')
    },
    {
      key: 'categories',
      title: 'Catégories',
      value: stats.categories.length,
      icon: <Tag size={20} />,
      color: '#13c2c2',
      suffix: 'actives',
      onClick: () => onStatClick?.('categories')
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
              {stat.key === 'out-of-stock' && (
                <Progress 
                  percent={(stats.outOfStock / stats.totalProducts) * 100} 
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

export default ProductStatsCards;