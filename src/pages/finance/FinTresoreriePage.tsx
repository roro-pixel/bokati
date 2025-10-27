import { Card, Row, Col, Button} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBankAccounts, useCashFlow } from '../../hooks/finance';

import BankReconciliation from '../../components/finance/tresorerie/BankReconciliation';
import {CashFlowForecast} from '../../components/finance/tresorerie/CashFlowForecast';
import {CashPositionMonitor} from '../../components/finance/tresorerie/CashPositionMonitor';
import {FinTransactionFlow} from '../../components/finance/tresorerie/FinTransactionFlow';

export const FinTresoreriePage = () => {
  const navigate = useNavigate();
  const { accounts, reconcileAccount } = useBankAccounts();
  const { forecasts, scenarios, runScenario } = useCashFlow();

  return (
    <div className="p-4">
           <div className="flex justify-between items-center mb-6">
  <div className="flex items-center">
    <Button 
      icon={<ArrowLeftOutlined />} 
      onClick={() => navigate('/finances')}
      type="text"
      className="mr-2 border border-gray-300"
    />
    <h2 className="text-xl font-semibold mb-0">Gestion de la Trésorerie</h2>
  </div>
</div>
      
      <Row gutter={16}>
        <Col span={24} className="mb-6">
          <CashPositionMonitor
            cashPositions={[]}
            bankAccounts={accounts}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <BankReconciliation
            accounts={accounts}
            onReconcile={reconcileAccount}
          />
        </Col>
        <Col span={12}>
          <CashFlowForecast
            forecasts={forecasts}
            scenarios={scenarios}
            onScenarioRun={runScenario}
          />
        </Col>
      </Row>

      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <FinTransactionFlow
            transactions={[]}
            accounts={accounts}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FinTresoreriePage;