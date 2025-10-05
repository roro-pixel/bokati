import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calculator, 
  BarChart as BarChartIcon, 
  Building, 
  FileText, 
  Users, 
  ShoppingBag, 
  Receipt 
} from 'lucide-react';

const Dashboard: React.FC = () => {

  const summaryData = {
    totalEcritures: 500,
    chiffreAffaires: 1200000,
    totalImmobilisations: 35,
    totalProvisions: 10,
    totalClients: 150,
    totalFournisseurs: 40,
    totalVentes: 300,
    totalFactures: 450,
  };

  const salesData = [
    { name: 'Jan', ventes: 100 },
    { name: 'Fév', ventes: 200 },
    { name: 'Mar', ventes: 150 },
    { name: 'Avr', ventes: 250 },
    { name: 'Mai', ventes: 300 },
  ];

  const pieData = [
    { name: 'Clients', value: summaryData.totalClients },
    { name: 'Fournisseurs', value: summaryData.totalFournisseurs },
  ];

  const pieColors = ['#733721ff', '#87cefa'];

  return (
    <div className="p-6 space-y-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-primary-900"
      >
        Tableau de bord général
      </motion.h1>

      {/* Résumé avec animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Écritures', value: summaryData.totalEcritures, icon: Calculator },
          { label: 'Chiffre d’affaires', value: `${summaryData.chiffreAffaires.toLocaleString()} FCFA`, icon: BarChartIcon },
          { label: 'Immobilisations', value: summaryData.totalImmobilisations, icon: Building },
          { label: 'Provisions', value: summaryData.totalProvisions, icon: FileText },
          { label: 'Clients/Fournisseurs', value: `${summaryData.totalClients}/${summaryData.totalFournisseurs}`, icon: Users },
          { label: 'Ventes', value: summaryData.totalVentes, icon: ShoppingBag },
          { label: 'Factures', value: summaryData.totalFactures, icon: Receipt },
        ].map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow"
          >
            <item.icon className="h-8 w-8 text-secondary-500" />
            <div>
              <p className="text-lg font-semibold text-primary-900">{item.value}</p>
              <p className="text-sm text-primary-500">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7 }}
          className="bg-white shadow-md rounded-lg p-4"
        >
          <h2 className="text-lg font-bold text-primary-900 mb-2">Ventes par mois</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <BarChart dataKey="ventes" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.7 }}
          className="bg-white shadow-md rounded-lg p-4"
        >
          <h2 className="text-lg font-bold text-primary-900 mb-2">Répartition Clients/Fournisseurs</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
