import React, { useState } from 'react';
import { 
  Tabs, 
  Card, 
  Space, 
  Button, 
  Modal,
  message 
} from 'antd';
import { 
  FileAddOutlined, 
  UploadOutlined, 
  HistoryOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '../../types';

// Composants du Module 5
import ComptaSaisiePieceComptable from '../../components/comptabilite/saisiePage/ComptaSaisiePieceComptable';
import ComptaSaisieCompletePiece from '../../components/comptabilite/saisiePage/ComptaSaisieCompletePiece';
import ComptaSaisieActions from '../../components/comptabilite/saisiePage/ComptaSaisieActions';
import ComptaOptionsMenuSuperieur from '../../components/comptabilite/saisiePage/ComptaOptionsMenuSuperieur';
import ComptaAjoutPieceSuccessive from '../../components/comptabilite/saisiePage/ComptaAjoutPieceSuccessive';
import ApprovalWorkflow from '../../components/comptabilite/saisiePage/ApprovalWorkflow';
import BatchProcessing from '../../components/comptabilite/saisiePage/BatchProcessing';
import EntryValidation from '../../components/comptabilite/saisiePage/EntryValidation';

// Hooks
import { useTransactionProcessing } from '../../hooks/comptabilite/module_five/useTransactionProcessing';
import { useEntryValidation } from '../../hooks/comptabilite/module_five/useEntryValidation';
import { useApprovalWorkflow } from '../../hooks/comptabilite/module_five/useApprovalWorkflow';

const { TabPane } = Tabs;

const ComptaSaisiePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saisie-simple');
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>();
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [showBatchImport, setShowBatchImport] = useState(false);

  // Utilisation des hooks
  const { 
    entries, 
    loading, 
    createEntry, 
    submitForApproval, 
    approveEntry, 
    rejectEntry,
    postEntry,
    validateEntry 
  } = useTransactionProcessing();

  const { validateEntry: validateEntryHook } = useEntryValidation();
  const { 
    workflows, 
    createApprovalWorkflow, 
    approveLevel, 
    rejectLevel,
    getRequiredApprovalLevels 
  } = useApprovalWorkflow();

  const handleSaveEntry = async (entry: JournalEntry) => {
    try {
      await createEntry(entry);
      message.success('Écriture sauvegardée avec succès');
      
      // Si le montant nécessite une approbation, créer le workflow
      const approvalInfo = getRequiredApprovalLevels(entry);
      if (approvalInfo.requiredLevels.length > 0) {
        await createApprovalWorkflow(entry.id, approvalInfo.requiredLevels);
      }
      
      setCurrentEntry(undefined);
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const handleSubmitForApproval = async (entryId: string) => {
    try {
      await submitForApproval(entryId);
      message.success('Écriture soumise pour approbation');
    } catch (error) {
      message.error('Erreur lors de la soumission');
    }
  };

  const handleQuickEntryLines = (lines: any[]) => {
    const newEntry: Partial<JournalEntry> = {
      journalId: 'GEN',
      entryDate: new Date(),
      accountingDate: new Date(),
      description: 'Saisie rapide',
      status: 'DRAFT',
      lines: lines
    };
    setCurrentEntry(newEntry);
    setShowQuickEntry(false);
    setActiveTab('saisie-complete');
  };

  const handleBatchImport = (importedEntries: JournalEntry[]) => {
    // Traiter les écritures importées
    importedEntries.forEach(entry => {
      createEntry(entry);
    });
    setShowBatchImport(false);
    message.success(`${importedEntries.length} écritures importées avec succès`);
  };

  const validationResult = currentEntry ? validateEntryHook(currentEntry as JournalEntry) : null;

  return (
    <div>
<Card 
  style={{ marginBottom: 16 }}
  title={
    <Space>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/comptabilite')}
        type="text"
      />
      <span>Saisie Comptable</span>
    </Space>
  }
  extra={[
    <Button 
      key="quick" 
      icon={<FileAddOutlined />}
      onClick={() => setShowQuickEntry(true)}
    >
      Saisie Rapide
    </Button>,
    <Button 
      key="batch" 
      icon={<UploadOutlined />}
      onClick={() => setShowBatchImport(true)}
    >
      Import par Lot
    </Button>,
    <Button 
      key="history" 
      icon={<HistoryOutlined />}
      onClick={() => navigate('/compta/edition')}
    >
      Historique
    </Button>
  ]}
>
  <div style={{ color: '#666' }}>
    Création et gestion des écritures comptables
  </div>
</Card>
      <ComptaOptionsMenuSuperieur
        onJournalChange={(journalId) => setCurrentEntry(prev => ({ ...prev, journalId }))}
        onCurrencyChange={(currency) => console.log('Devise changée:', currency)}
        onExchangeRateSet={(rate) => console.log('Taux de change:', rate)}
        onTemplateApply={(templateId) => console.log('Template appliqué:', templateId)}
      />


<Tabs 
  activeKey={activeTab} 
  onChange={setActiveTab}
  items={[
    {
      key: 'saisie-simple',
      label: 'Saisie Standard',
      children: (
        <Card>
          <ComptaSaisiePieceComptable
            initialEntry={currentEntry}
            onSave={handleSaveEntry}
            onCancel={() => setCurrentEntry(undefined)}
          />
        </Card>
      )
    },
    {
      key: 'saisie-complete',
      label: 'Saisie Complète',
      children: currentEntry ? (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <ComptaSaisieCompletePiece
            entry={currentEntry}
            onChange={setCurrentEntry}
          />
          <ComptaSaisiePieceComptable
            initialEntry={currentEntry}
            onSave={handleSaveEntry}
            onCancel={() => setCurrentEntry(undefined)}
          />
          {validationResult && (
            <EntryValidation validationResult={validationResult} />
          )}
          <ComptaSaisieActions
            entry={currentEntry as JournalEntry}
            onSave={() => handleSaveEntry(currentEntry as JournalEntry)}
            onSubmit={() => handleSubmitForApproval(currentEntry.id!)}
            onApprove={() => approveEntry(currentEntry.id!)}
            onReject={() => rejectEntry(currentEntry.id!, 'Raison du rejet')}
            onPost={() => postEntry(currentEntry.id!)}
            onDuplicate={() => console.log('Dupliquer')}
            onDelete={() => setCurrentEntry(undefined)}
            onPrint={() => console.log('Imprimer')}
            isValid={validationResult?.isValid || false}
            isSubmitting={loading}
          />
        </Space>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Aucune écriture en cours. Créez d'abord une écriture dans l'onglet "Saisie Standard".
          </div>
        </Card>
      )
    },
    {
      key: 'workflow',
      label: 'Workflow',
      children: currentEntry ? (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <ApprovalWorkflow
            workflows={workflows.filter(wf => wf.entryId === currentEntry.id)}
            entry={currentEntry as JournalEntry}
            currentUserRole="ACCOUNTANT"
            onApprove={approveLevel}
            onReject={rejectLevel}
            canApprove={(level) => level <= 2}
          />
        </Space>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Aucune écriture en cours. Créez d'abord une écriture dans l'onglet "Saisie Standard".
          </div>
        </Card>
      )
    }
  ]}
/>

      {/* Modal Saisie Rapide */}
      <Modal
        title="Saisie Rapide d'Écriture"
        open={showQuickEntry}
        onCancel={() => setShowQuickEntry(false)}
        footer={null}
        width={800}
      >
        <ComptaAjoutPieceSuccessive
          onLinesAdd={handleQuickEntryLines}
          onCancel={() => setShowQuickEntry(false)}
        />
      </Modal>

      {/* Modal Import par Lot */}
      <Modal
        title="Importation par Lot"
        open={showBatchImport}
        onCancel={() => setShowBatchImport(false)}
        footer={null}
        width={1000}
      >
        <BatchProcessing onEntriesImport={handleBatchImport} />
      </Modal>
    </div>
  );
};

export default ComptaSaisiePage;