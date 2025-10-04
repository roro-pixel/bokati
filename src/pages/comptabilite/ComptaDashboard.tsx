import { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Menu, Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChartOutlined,
  TransactionOutlined,
  FileSearchOutlined,
  SettingOutlined,
  SyncOutlined,
  DollarOutlined,
  AuditOutlined,
  BookOutlined,
  RightOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ComptaDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resume');

  const recentTransactions = [
    { id: 'TRX-001', date: '15/05/2023', compte: '701000', montant: 1500, statut: 'Validé' },
    { id: 'TRX-002', date: '14/05/2023', compte: '411000', montant: -800, statut: 'En attente' },
    { id: 'TRX-003', date: '13/05/2023', compte: '512000', montant: 2500, statut: 'Validé' },
  ];

  const balanceSummary = [
    { type: 'Actif', montant: 150000, color: '#1b5489ff' },  
    { type: 'Passif', montant: 120000, color: '#57a12cff' },  
    { type: 'Résultat', montant: 30000, color: '#df8e2bff' },
  ];

  const colorTypeBalanceSummary = [
    {color: '#1b5489ff'},
    {color: '#57a12cff'},
    {color: '#df8e2bff'}, 
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="compta-dashboard"
    >
      <motion.h1 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Tableau de Bord Comptable
      </motion.h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {[
          { title: "Écritures ce mois", value: 42, icon: <TransactionOutlined />, link: '/compta/saisie' },
          { title: "Comptes actifs", value: 127, icon: <BookOutlined />, link: '/compta/comptes' },
          { title: "Journaux", value: 8, icon: <FileSearchOutlined />, link: '/compta/journaux' },
          { title: "Anomalies", value: 3, icon: <AuditOutlined />, link: '/compta/parametres' }
        ].map((item, index) => (
          <Col span={6} key={index}>
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard onClick={() => navigate(item.link)}>
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={item.icon}
                />
                <motion.div
                  style={{ float: 'right', color: '#096dd9' }} 
                  whileHover={{ x: 3 }}
                >
                  <RightOutlined />
                </motion.div>
              </AnimatedCard>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card 
          title="Synthèse de Balance"
          extra={
            <Button 
              type="link" 
              onClick={() => navigate('/compta/configuration/balance')}
              icon={<RightOutlined />}
            >
              Voir détail
            </Button>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            {balanceSummary.map((item, index) => (
              <Col span={8} key={item.type}>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Progress
                    type="dashboard"
                    percent={Math.min(100, Math.abs(item.montant) / 2000 * 100)}
                    format={() => (
                      <motion.div whileHover={{ scale: 1.05 }} style={{color: '#0e0f10b8'}}>
                        {`${item.type}: ${item.montant.toLocaleString()} FCFA`}
                      </motion.div>
                      
                    )}
                    strokeColor={item.color}
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card
          title="Dernières Écritures"
          extra={
            <Button 
              type="link" 
              onClick={() => navigate('/compta/saisie')}
              icon={<RightOutlined />}
            >
              Toutes les écritures
            </Button>
          }
          style={{ marginBottom: 24 }}
        >
          <Table
            columns={[
              { title: 'Réf.', dataIndex: 'id' },
              { title: 'Date', dataIndex: 'date' },
              { title: 'Compte', dataIndex: 'compte' },
              { 
                title: 'Montant', 
                dataIndex: 'montant', 
                render: val => (
                  <motion.span
                    style={{ color: val > 0 ? '#407b1dff' : '#ff4d4f' }} 
                    whileHover={{ scale: 1.05 }}
                  >
                    {`${val} FCFA`}
                  </motion.span>
                )
              },
              { title: 'Statut', dataIndex: 'statut' },
            ]}
            dataSource={recentTransactions}
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: () => navigate(`/compta/edition/transaction/${record.id}`),
            })}
            rowClassName="clickable-row"
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card title="Accès Rapide">
          <Menu 
            mode="horizontal" 
            style={{ justifyContent: 'center' }}
            selectedKeys={[]}
          >
            {[
              { key: 'saisie', icon: <FileAddOutlined />, label: 'Nouvelle Saisie', link: '/compta/saisie' },
              { key: 'rapprochement', icon: <SyncOutlined />, label: 'Rapprochement', link: '/compta/parametres/rapprocher' },
              { key: 'cloture', icon: <DollarOutlined />, label: 'Clôture', link: '/compta/configuration/cloture' },
              { key: 'config', icon: <SettingOutlined />, label: 'Configuration', link: '/compta/configuration' }
            ].map(item => (
              <Menu.Item 
                key={item.key} 
                icon={item.icon}
                onClick={() => navigate(item.link)}
              >
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring' }}
                >
                  {item.label}
                </motion.div>
              </Menu.Item>
            ))}
          </Menu>
        </Card>
      </motion.div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '300px',
            zIndex: -1,
            color: '#f0f2f5'
          }}
        >
          <PieChartOutlined />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ComptaDashboard;
