import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Badge } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  ShoppingCartOutlined,
  BoxPlotOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  BankOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Product, ProductType } from '../../types';
import ProductForm from './ProductForm';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
  onView
}) => {
  const getTypeColor = (type: ProductType) => {
    switch (type) {
      case 'PRODUIT': return 'blue';
      case 'SERVICE': return 'green';
      case 'MATIERE': return 'orange';
      case 'IMMOBILISATION': return 'purple';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: ProductType) => {
    switch (type) {
      case 'PRODUIT': return <BoxPlotOutlined />;
      case 'SERVICE': return <ToolOutlined />;
      case 'MATIERE': return <ThunderboltOutlined />;
      case 'IMMOBILISATION': return <BankOutlined />;
      default: return <BoxPlotOutlined />;
    }
  };

  const getStockStatus = (product: Product) => {
    const availableStock = product.currentStock - product.reservedStock;
    
    if (availableStock <= 0) {
      return { status: 'error', text: 'Rupture', color: '#ff4d4f' };
    } else if (availableStock < product.minimumStock) {
      return { status: 'warning', text: 'Stock faible', color: '#faad14' };
    } else {
      return { status: 'success', text: 'En stock', color: '#52c41a' };
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => (
        <motion.span whileHover={{ scale: 1.05 }} style={{ fontWeight: 'bold' }}>
          {code}
        </motion.span>
      )
    },
    {
      title: 'Produit',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <Space direction="vertical" size={0}>
          <strong>{name}</strong>
          <small style={{ color: '#666' }}>{record.reference}</small>
          {record.brand && (
            <small style={{ color: '#999' }}>Marque: {record.brand}</small>
          )}
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: ProductType) => (
        <Tag color={getTypeColor(type)}>
          {getTypeIcon(type)} {type}
        </Tag>
      )
    },
    {
      title: 'Stock',
      key: 'stock',
      width: 120,
      render: (_, record: Product) => {
        const stockStatus = getStockStatus(record);
        const availableStock = record.currentStock - record.reservedStock;
        
        return (
          <Space direction="vertical" size={2}>
            <Badge 
              status={stockStatus.status as any} 
              text={stockStatus.text}
            />
            <small style={{ color: '#666' }}>
              {availableStock} / {record.currentStock} dispo.
            </small>
          </Space>
        );
      }
    },
    {
      title: 'Prix',
      key: 'price',
      width: 120,
      render: (_, record: Product) => (
        <Space direction="vertical" size={0}>
          <strong style={{ color: '#1890ff' }}>
            {record.standardPrice.toLocaleString()} FCFA
          </strong>
          <small style={{ color: '#666' }}>
            Coût: {record.costPrice.toLocaleString()} FCFA
          </small>
        </Space>
      )
    },
    {
      title: 'Statut',
      key: 'status',
      width: 100,
      render: (_, record: Product) => (
        <Space direction="vertical" size={2}>
          <Tag color={record.isActive ? 'success' : 'default'}>
            {record.isActive ? 'Actif' : 'Inactif'}
          </Tag>
          {record.isSellable && (
            <Tag color="blue" icon={<ShoppingCartOutlined />}>
              Vente
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: Product) => (
        <Space>
          <Tooltip title="Voir détails">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} sur ${total} produits`
        }}
        scroll={{ x: 1000 }}
      />
    </motion.div>
  );
};

export default ProductsTable;