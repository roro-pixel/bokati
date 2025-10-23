import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Button, Switch, Modal, Form, Select, Alert, Tree, Divider, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { 
  UserOutlined, 
  TeamOutlined,
  LockOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

// Types locaux pour les autorisations
interface UserPermission {
  id: string;
  username: string;
  role: string;
  department: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
}

interface PermissionGroup {
  key: string;
  title: string;
  children: PermissionItem[];
}

interface PermissionItem {
  key: string;
  title: string;
  description: string;
}

export const ComptaAutorisations: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Données mock pour les utilisateurs
  const mockUsers: UserPermission[] = [
    {
      id: '1',
      username: 'admin.compta',
      role: 'Administrateur Comptable',
      department: 'Comptabilité',
      permissions: ['all'],
      isActive: true,
      lastLogin: new Date('2024-06-20T09:30:00')
    },
    {
      id: '2',
      username: 'saisie.user',
      role: 'Agent de Saisie',
      department: 'Comptabilité',
      permissions: ['saisie', 'consultation'],
      isActive: true,
      lastLogin: new Date('2024-06-19T16:45:00')
    },
    {
      id: '3',
      username: 'validation.user',
      role: 'Validateur',
      department: 'Comptabilité',
      permissions: ['saisie', 'validation', 'consultation'],
      isActive: true,
      lastLogin: new Date('2024-06-20T08:15:00')
    },
    {
      id: '4',
      username: 'consult.user',
      role: 'Consultant',
      department: 'Direction',
      permissions: ['consultation', 'rapports'],
      isActive: true,
      lastLogin: new Date('2024-06-18T14:20:00')
    }
  ];

  // Arbre des permissions
  const permissionTree: PermissionGroup[] = [
    {
      key: 'saisie',
      title: 'Saisie Comptable',
      children: [
        {
          key: 'saisie-create',
          title: 'Créer écritures',
          description: 'Créer de nouvelles écritures comptables'
        },
        {
          key: 'saisie-edit',
          title: 'Modifier écritures',
          description: 'Modifier les écritures en brouillon'
        },
        {
          key: 'saisie-delete',
          title: 'Supprimer écritures',
          description: 'Supprimer les écritures non validées'
        }
      ]
    },
    {
      key: 'validation',
      title: 'Validation',
      children: [
        {
          key: 'validation-approve',
          title: 'Approuver écritures',
          description: 'Approuver les écritures soumises'
        },
        {
          key: 'validation-reject',
          title: 'Rejeter écritures',
          description: 'Rejeter les écritures avec motif'
        }
      ]
    },
    {
      key: 'consultation',
      title: 'Consultation',
      children: [
        {
          key: 'consultation-view',
          title: 'Voir données',
          description: 'Consulter les écritures et soldes'
        },
        {
          key: 'consultation-export',
          title: 'Exporter données',
          description: 'Exporter les rapports et données'
        }
      ]
    },
    {
      key: 'configuration',
      title: 'Configuration',
      children: [
        {
          key: 'config-accounts',
          title: 'Gérer plan comptable',
          description: 'Modifier le plan comptable'
        },
        {
          key: 'config-journals',
          title: 'Gérer journaux',
          description: 'Configurer les journaux comptables'
        },
        {
          key: 'config-system',
          title: 'Paramètres système',
          description: 'Modifier les paramètres généraux'
        }
      ]
    },
    {
      key: 'rapports',
      title: 'Rapports et Éditions',
      children: [
        {
          key: 'reports-balance',
          title: 'Générer balances',
          description: 'Générer les balances comptables'
        },
        {
          key: 'reports-financial',
          title: 'États financiers',
          description: 'Produire les états financiers'
        },
        {
          key: 'reports-fiscal',
          title: 'Déclarations fiscales',
          description: 'Générer les déclarations fiscales'
        }
      ]
    }
  ];

  const handleEditPermissions = (user: UserPermission) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions);
    setPermissionModalVisible(true);
  };

  const handleSavePermissions = () => {
    // Ici, on sauvegarderait les permissions en base de données
    console.log('Sauvegarde permissions:', selectedPermissions, 'pour user:', selectedUser?.username);
    setPermissionModalVisible(false);
    setSelectedUser(null);
  };

  const onCheckPermissions = (checkedKeys: any) => {
    setSelectedPermissions(checkedKeys.checked);
  };

  const columns = [
    {
      title: 'Utilisateur',
      dataIndex: 'username',
      key: 'username',
      render: (username: string, record: UserPermission) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{username}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.department}</div>
        </div>
      )
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>
    },
    {
      title: 'Statut',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isActive ? 'Actif' : 'Inactif'}
        </Tag>
      )
    },
    {
      title: 'Dernière connexion',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: Date) => date ? new Date(date).toLocaleDateString() : 'Jamais'
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (_, record: UserPermission) => (
        <div>
          {record.permissions.includes('all') ? (
            <Tag color="green">Toutes permissions</Tag>
          ) : (
            record.permissions.map(perm => (
              <Tag key={perm} color="blue" style={{ marginBottom: 2 }}>
                {perm}
              </Tag>
            ))
          )}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: UserPermission) => (
        <Button 
          icon={<EditOutlined />}
          onClick={() => handleEditPermissions(record)}
        >
          Modifier
        </Button>
      )
    }
  ];

  const activeUsers = mockUsers.filter(user => user.isActive).length;
  const adminUsers = mockUsers.filter(user => user.role.includes('Administrateur')).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LockOutlined />
            Gestion des Autorisations Comptables
          </div>
        }
      >
        {/* Statistiques */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Utilisateurs Actifs"
                value={activeUsers}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Administrateurs"
                value={adminUsers}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Rôles Définis"
                value={4}
                valueStyle={{ color: '#389e0d' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Droits Personnalisés"
                value={12}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table des utilisateurs */}
        <Card title="Utilisateurs et Permissions" size="small">
          <Table
            columns={columns}
            dataSource={mockUsers}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* Modal de gestion des permissions */}
        <Modal
          title={`Gestion des Permissions - ${selectedUser?.username}`}
          open={permissionModalVisible}
          onCancel={() => setPermissionModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setPermissionModalVisible(false)}>
              Annuler
            </Button>,
            <Button key="save" type="primary" onClick={handleSavePermissions}>
              Sauvegarder
            </Button>
          ]}
          width={800}
        >
          {selectedUser && (
            <div>
              <Alert
                message={`Modification des permissions pour ${selectedUser.username} (${selectedUser.role})`}
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Profil Actuel" size="small">
                    <div style={{ lineHeight: '2' }}>
                      <div><strong>Utilisateur:</strong> {selectedUser.username}</div>
                      <div><strong>Rôle:</strong> {selectedUser.role}</div>
                      <div><strong>Département:</strong> {selectedUser.department}</div>
                      <div>
                        <strong>Statut:</strong> 
                        <Tag color={selectedUser.isActive ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                          {selectedUser.isActive ? 'Actif' : 'Inactif'}
                        </Tag>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Permissions Actuelles" size="small">
                    {selectedUser.permissions.includes('all') ? (
                      <Tag color="green" style={{ fontSize: '14px', padding: '8px' }}>
                        Toutes les permissions sont accordées
                      </Tag>
                    ) : (
                      selectedUser.permissions.map(perm => (
                        <Tag key={perm} color="blue" style={{ margin: '4px' }}>
                          {perm}
                        </Tag>
                      ))
                    )}
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Card title="Modifier les Permissions" size="small">
                <Tree
                  checkable
                  treeData={permissionTree}
                  checkedKeys={selectedPermissions}
                  onCheck={onCheckPermissions}
                  defaultExpandAll
                  style={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Card>

              <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                Les modifications prendront effet immédiatement après sauvegarde
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </motion.div>
  );
};

export default ComptaAutorisations;