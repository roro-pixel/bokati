import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Badge } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SendOutlined,
  FilePdfOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Invoice, InvoiceStatus, PaymentStatus } from '../../types';

interface InvoicesTableProps {
  invoices: Invoice[];
  loading: boolean;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onView: (invoice: Invoice) => void;
  onSend: (invoiceId: string) => void;
  onRecordPayment: (invoice: Invoice) => void;
  onGeneratePDF: (invoiceId: string) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
  invoices,
  loading,
  onEdit,
  onDelete,
  onView,
  onSend,
  onRecordPayment,
  onGeneratePDF
}) => {
  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'BROUILLON': return 'default';
      case 'EMISE': return 'blue';
      case 'ENVOYEE': return 'processing';
      case 'PARTIELLEMENT_PAYEE': return 'orange';
      case 'PAYEE': return 'success';
      case 'ANNULEE': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: InvoiceStatus) => {
    switch (status) {
      case 'BROUILLON': return 'Brouillon';
      case 'EMISE': return 'Émise';
      case 'ENVOYEE': return 'Envoyée';
      case 'PARTIELLEMENT_PAYEE': return 'Partiellement payée';
      case 'PAYEE': return 'Payée';
      case 'ANNULEE': return 'Annulée';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'EN_ATTENTE': return 'default';
      case 'PARTIEL': return 'orange';
      case 'PAYE': return 'success';
      case 'EN_RETARD': return 'error';
      default: return 'default';
    }
  };

  const isOverdue = (invoice: Invoice) => {
    return new Date() > invoice.dueDate && invoice.paymentStatus !== 'PAYE';
  };

  const columns = [
    {
      title: 'N° Facture',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 120,
      render: (number: string) => (
        <motion.span whileHover={{ scale: 1.05 }} style={{ fontWeight: 'bold' }}>
          {number}
        </motion.span>
      )
    },
    {
      title: 'Client',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Échéance',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 100,
      render: (date: Date, record: Invoice) => (
        <span style={{ 
          color: isOverdue(record) ? '#ff4d4f' : '#666',
          fontWeight: isOverdue(record) ? 'bold' : 'normal'
        }}>
          {new Date(date).toLocaleDateString('fr-FR')}
          {isOverdue(record) && ' ⚠️'}
        </span>
      )
    },
    {
      title: 'Montant',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number, record: Invoice) => (
        <Space direction="vertical" size={0}>
          <strong style={{ color: '#1890ff' }}>
            {amount.toLocaleString()} FCFA
          </strong>
          <small style={{ color: record.dueAmount > 0 ? '#ff4d4f' : '#52c41a' }}>
            Dû: {record.dueAmount.toLocaleString()} FCFA
          </small>
        </Space>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: InvoiceStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Paiement',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: PaymentStatus, record: Invoice) => (
        <Badge 
          status={getPaymentStatusColor(status) as any} 
          text={status.replace('_', ' ')}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: Invoice) => (
        <Space>
          <Tooltip title="Voir détails">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Générer PDF">
            <Button 
              type="text" 
              icon={<FilePdfOutlined />}
              onClick={() => onGeneratePDF(record.id)}
            />
          </Tooltip>
          {record.status === 'EMISE' && (
            <Tooltip title="Envoyer au client">
              <Button 
                type="text" 
                icon={<SendOutlined />}
                onClick={() => onSend(record.id)}
              />
            </Tooltip>
          )}
          {record.dueAmount > 0 && (
            <Tooltip title="Enregistrer paiement">
              <Button 
                type="text" 
                icon={<DollarOutlined />}
                onClick={() => onRecordPayment(record)}
              />
            </Tooltip>
          )}
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
        dataSource={invoices}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} sur ${total} factures`
        }}
        scroll={{ x: 1000 }}
      />
    </motion.div>
  );
};

export default InvoicesTable;