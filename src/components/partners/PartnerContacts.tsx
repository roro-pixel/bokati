import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Select,
  Switch,
  message,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PhoneOutlined,
  MailOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { PartnerContact } from '../../types';

const { Option } = Select;

interface PartnerContactsProps {
  contacts: PartnerContact[];
  partnerId: string;
  onContactsUpdate: (contacts: PartnerContact[]) => void;
}

const PartnerContacts: React.FC<PartnerContactsProps> = ({
  contacts,
  partnerId,
  onContactsUpdate
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<PartnerContact | null>(null);
  const [form] = Form.useForm();

  const departments = [
    'DIRECTION',
    'FINANCE',
    'COMMERCIAL',
    'ACHATS',
    'TECHNIQUE',
    'ADMINISTRATION',
    'LOGISTIQUE',
    'RH',
    'MARKETING',
    'AUTRE'
  ];

  const handleAddContact = () => {
    setEditingContact(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditContact = (contact: PartnerContact) => {
    setEditingContact(contact);
    form.setFieldsValue(contact);
    setIsModalVisible(true);
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    onContactsUpdate(updatedContacts);
    message.success('Contact supprimé avec succès');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const contactData = {
        ...values,
        id: editingContact?.id || `ct-${Date.now()}`,
        partnerId,
        isPrimary: values.isPrimary || false
      };

      let updatedContacts;
      if (editingContact) {
        // Modification
        updatedContacts = contacts.map(contact =>
          contact.id === editingContact.id ? { ...contact, ...contactData } : contact
        );
        message.success('Contact modifié avec succès');
      } else {
        // Nouveau contact - si c'est le premier, le rendre primaire par défaut
        if (contacts.length === 0) {
          contactData.isPrimary = true;
        }
        updatedContacts = [...contacts, contactData];
        message.success('Contact ajouté avec succès');
      }

      onContactsUpdate(updatedContacts);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleSetPrimary = (contactId: string) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === contactId
    }));
    onContactsUpdate(updatedContacts);
    message.success('Contact principal défini');
  };

  const columns = [
    {
      title: 'Nom',
      key: 'name',
      render: (_, record: PartnerContact) => (
        <Space>
          <UserOutlined />
          <span>
            {record.firstName} {record.lastName}
            {record.isPrimary && (
              <Tag color="blue" style={{ marginLeft: 8 }}>Principal</Tag>
            )}
          </span>
        </Space>
      )
    },
    {
      title: 'Poste',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: 'Département',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => dept && <Tag>{dept}</Tag>
    },
    {
      title: 'Téléphone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Space>
          <MailOutlined />
          {email}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: PartnerContact) => (
        <Space>
          {!record.isPrimary && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleSetPrimary(record.id)}
            >
              Définir principal
            </Button>
          )}
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEditContact(record)}
          />
          <Popconfirm
            title="Supprimer le contact"
            description="Êtes-vous sûr de vouloir supprimer ce contact ?"
            onConfirm={() => handleDeleteContact(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
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
      <Card 
        title="Contacts"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddContact}
          >
            Ajouter un contact
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={contacts}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: 'Aucun contact enregistré'
          }}
        />

        <Modal
          title={editingContact ? 'Modifier le contact' : 'Nouveau contact'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="firstName"
              label="Prénom"
              rules={[{ required: true, message: 'Champ obligatoire' }]}
            >
              <Input placeholder="Prénom" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Nom"
              rules={[{ required: true, message: 'Champ obligatoire' }]}
            >
              <Input placeholder="Nom" />
            </Form.Item>

            <Form.Item
              name="position"
              label="Poste"
              rules={[{ required: true, message: 'Champ obligatoire' }]}
            >
              <Input placeholder="Ex: Directeur Commercial" />
            </Form.Item>

            <Form.Item
              name="department"
              label="Département"
            >
              <Select placeholder="Sélectionnez un département">
                {departments.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="phone"
              label="Téléphone"
              rules={[{ required: true, message: 'Champ obligatoire' }]}
            >
              <Input placeholder="+237 XXX XXX XXX" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Champ obligatoire' },
                { type: 'email', message: 'Email invalide' }
              ]}
            >
              <Input placeholder="email@entreprise.com" />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Notes"
            >
              <Input.TextArea placeholder="Informations complémentaires..." rows={3} />
            </Form.Item>

            <Form.Item
              name="isPrimary"
              label="Contact principal"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </motion.div>
  );
};

export default PartnerContacts;