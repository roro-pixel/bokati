import React from 'react';
import { Space, Button, Dropdown, Menu, message } from 'antd';
import { 
  SaveOutlined, 
  SendOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  MoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { JournalEntry, EntryStatus } from '../../../types';

interface ComptaSaisieActionsProps {
  entry: JournalEntry;
  onSave: () => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
  onPost: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPrint: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
}

const ComptaSaisieActions: React.FC<ComptaSaisieActionsProps> = ({
  entry,
  onSave,
  onSubmit,
  onApprove,
  onReject,
  onPost,
  onDuplicate,
  onDelete,
  onPrint,
  isValid,
  isSubmitting = false
}) => {
  const getStatusActions = () => {
    switch (entry.status) {
      case 'DRAFT':
        return (
          <Space>
            <Button 
              icon={<SaveOutlined />}
              onClick={onSave}
              loading={isSubmitting}
            >
              Enregistrer Brouillon
            </Button>
            <Button 
              type="primary"
              icon={<SendOutlined />}
              onClick={onSubmit}
              disabled={!isValid}
              loading={isSubmitting}
            >
              Soumettre
            </Button>
          </Space>
        );

      case 'SUBMITTED':
        return (
          <Space>
            <Button 
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={onApprove}
              loading={isSubmitting}
            >
              Approuver
            </Button>
            <Button 
              danger
              icon={<CloseCircleOutlined />}
              onClick={onReject}
              loading={isSubmitting}
            >
              Rejeter
            </Button>
          </Space>
        );

      case 'APPROVED':
        return (
          <Button 
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onPost}
            loading={isSubmitting}
          >
            Poster l'écriture
          </Button>
        );

      case 'POSTED':
        return (
          <Button disabled>
            Écriture Postée
          </Button>
        );

      default:
        return null;
    }
  };

  const moreMenu = (
    <Menu
      items={[
        {
          key: 'duplicate',
          icon: <CopyOutlined />,
          label: 'Dupliquer',
          onClick: onDuplicate
        },
        {
          key: 'print',
          icon: <FileTextOutlined />,
          label: 'Imprimer',
          onClick: onPrint
        },
        {
          type: 'divider'
        },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: 'Supprimer',
          danger: true,
          onClick: onDelete,
          disabled: entry.status !== 'DRAFT'
        }
      ]}
    />
  );

  return (
    <Space style={{ width: '100%', justifyContent: 'space-between', padding: '16px 0' }}>
      {/* Actions principales selon le statut */}
      <div>
        {getStatusActions()}
      </div>

      {/* Menu supplémentaire */}
      <Dropdown overlay={moreMenu} placement="bottomRight">
        <Button icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

export default ComptaSaisieActions;