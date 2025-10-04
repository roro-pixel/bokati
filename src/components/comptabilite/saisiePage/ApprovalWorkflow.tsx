import React from 'react';
import { Card, Timeline, Tag, Space, Button, Modal, Form, Input, message } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  UserOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { ApprovalWorkflow as ApprovalWorkflowType, JournalEntry } from '../../../types';

const { TextArea } = Input;

interface ApprovalWorkflowProps {
  workflows: ApprovalWorkflowType[];
  entry: JournalEntry;
  currentUserRole: string;
  onApprove: (workflowId: string, comments?: string) => void;
  onReject: (workflowId: string, comments: string) => void;
  canApprove: (level: number) => boolean;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  workflows,
  entry,
  currentUserRole,
  onApprove,
  onReject,
  canApprove
}) => {
  const [approvalModal, setApprovalModal] = useState<{ visible: boolean; workflowId?: string; type?: 'approve' | 'reject' }>({ 
    visible: false 
  });
  const [form] = Form.useForm();

  const approvalLevels = [
    { level: 1, label: 'Manager Départemental', amount: '≤ 100,000 FCFA' },
    { level: 2, label: 'Directeur Financier', amount: '≤ 1,000,000 FCFA' },
    { level: 3, label: 'Directeur Général', amount: '> 1,000,000 FCFA' }
  ];

  const getWorkflowStatus = (level: number) => {
    const workflow = workflows.find(wf => wf.level === level);
    if (!workflow) return 'pending';
    return workflow.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'REJECTED': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <ClockCircleOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      default: return 'orange';
    }
  };

  const handleApprove = (workflowId: string) => {
    setApprovalModal({ visible: true, workflowId, type: 'approve' });
  };

  const handleReject = (workflowId: string) => {
    setApprovalModal({ visible: true, workflowId, type: 'reject' });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const { workflowId, type } = approvalModal;
      if (workflowId) {
        if (type === 'approve') {
          onApprove(workflowId, values.comments);
          message.success('Écriture approuvée');
        } else {
          onReject(workflowId, values.comments);
          message.success('Écriture rejetée');
        }
      }
      setApprovalModal({ visible: false });
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setApprovalModal({ visible: false });
    form.resetFields();
  };

  return (
    <>
      <Card title="Workflow d'approbation" size="small">
        <Timeline>
          {approvalLevels.map(({ level, label, amount }) => {
            const status = getWorkflowStatus(level);
            const workflow = workflows.find(wf => wf.level === level);
            const canUserApprove = canApprove(level);

            return (
              <Timeline.Item
                key={level}
                dot={getStatusIcon(status)}
                color={getStatusColor(status)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{label}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Seuil: {amount}
                      </div>
                    </div>
                    
                    <Space>
                      <Tag color={getStatusColor(status)}>
                        {status === 'APPROVED' ? 'Approuvé' : 
                         status === 'REJECTED' ? 'Rejeté' : 'En attente'}
                      </Tag>
                      
                      {status === 'PENDING' && canUserApprove && (
                        <Space>
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={() => handleApprove(workflow?.id!)}
                          >
                            Approuver
                          </Button>
                          <Button 
                            size="small" 
                            danger
                            onClick={() => handleReject(workflow?.id!)}
                          >
                            Rejeter
                          </Button>
                        </Space>
                      )}
                    </Space>
                  </div>

                  {workflow?.comments && (
                    <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                      Commentaire: {workflow.comments}
                    </div>
                  )}

                  {workflow?.approvedAt && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      <UserOutlined /> Traité le {workflow.approvedAt.toLocaleDateString()}
                    </div>
                  )}
                </Space>
              </Timeline.Item>
            );
          })}
        </Timeline>

        {/* Résumé du workflow */}
        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>Montant de l'écriture:</strong>{' '}
              {Math.max(entry.totalDebit, entry.totalCredit).toLocaleString()} FCFA
            </div>
            <div>
              <strong>Niveaux requis:</strong>{' '}
              {workflows.length > 0 ? 
                `Niveaux ${workflows.map(wf => wf.level).join(', ')}` : 
                'Aucun niveau requis'
              }
            </div>
            <div>
              <strong>Statut global:</strong>{' '}
              <Tag color={
                workflows.every(wf => wf.status === 'APPROVED') ? 'green' :
                workflows.some(wf => wf.status === 'REJECTED') ? 'red' : 'orange'
              }>
                {workflows.every(wf => wf.status === 'APPROVED') ? 'Totalement approuvé' :
                 workflows.some(wf => wf.status === 'REJECTED') ? 'Rejeté' : 'En cours d\'approbation'}
              </Tag>
            </div>
          </Space>
        </div>
      </Card>

      {/* Modal d'approbation/rejet */}
      <Modal
        title={approvalModal.type === 'approve' ? 'Approuver l\'écriture' : 'Rejeter l\'écriture'}
        open={approvalModal.visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={approvalModal.type === 'approve' ? 'Approuver' : 'Rejeter'}
        okButtonProps={{ 
          type: approvalModal.type === 'approve' ? 'primary' : undefined,
          danger: approvalModal.type === 'reject'
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="comments"
            label="Commentaire (optionnel)"
          >
            <TextArea
              rows={4}
              placeholder={
                approvalModal.type === 'approve' ? 
                "Ajouter un commentaire d'approbation..." :
                "Expliquer les raisons du rejet..."
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ApprovalWorkflow;