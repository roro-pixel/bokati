import React from 'react';
import { Tree, Card, Tag, Space, Button } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ChartAccount } from '../../../types';

interface AccountHierarchyProps {
  accounts: ChartAccount[];
  onEditAccount: (account: ChartAccount) => void;
  onAddChild: (parentAccount: ChartAccount) => void;
  expandedKeys?: string[];
  onExpand?: (keys: string[]) => void;
}

const AccountHierarchy: React.FC<AccountHierarchyProps> = ({
  accounts,
  onEditAccount,
  onAddChild,
  expandedKeys = [],
  onExpand
}) => {
  const buildTreeData = (accountList: ChartAccount[]): any[] => {
    const hierarchy: { [key: string]: ChartAccount[] } = {};
    
    // Construire la hiérarchie
    accountList.forEach(account => {
      if (account.parentId) {
        if (!hierarchy[account.parentId]) {
          hierarchy[account.parentId] = [];
        }
        hierarchy[account.parentId].push(account);
      }
    });

    const rootAccounts = accountList.filter(acc => !acc.parentId);

    const buildNode = (account: ChartAccount): any => {
      const children = hierarchy[account.id] || [];
      
      return {
        key: account.id,
        title: (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '4px 0'
          }}>
            <div style={{ flex: 1 }}>
              <Space>
                <strong style={{ minWidth: '60px' }}>{account.code}</strong>
                <span>{account.name}</span>
                {!account.isActive && <Tag color="red">Inactif</Tag>}
                {account.isAuxiliary && <Tag color="blue" size="small">Aux</Tag>}
                {account.isReconcilable && <Tag color="green" size="small">Rappro</Tag>}
              </Space>
              {account.description && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '2px',
                  fontStyle: 'italic'
                }}>
                  {account.description}
                </div>
              )}
            </div>
            <Space>
              <Button 
                type="link" 
                size="small" 
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(account);
                }}
                title="Ajouter un compte enfant"
              />
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditAccount(account);
                }}
                title="Modifier le compte"
              />
            </Space>
          </div>
        ),
        children: children.map(buildNode),
        account
      };
    };

    return rootAccounts.map(buildNode);
  };

  const treeData = buildTreeData(accounts);

  return (
    <Card 
      title="Hiérarchie des Comptes" 
      size="small"
      bodyStyle={{ padding: '8px' }}
    >
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        defaultExpandAll={false}
        showLine={{ showLeafIcon: false }}
        blockNode
        style={{ padding: '8px 0' }}
      />
    </Card>
  );
};

export default AccountHierarchy;