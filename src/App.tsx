import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/authentification/useAuth';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/authentification/Login';
import Dashboard from './pages/Dashboard';
import {Settings} from './pages/parametres/Settings';
import ComptaDashboard from './pages/comptabilite/ComptaDashboard';
import ComptaSaisiePage from './pages/comptabilite/ComptaSaisiePage';
import ComptaComptesPages from './pages/comptabilite/ComptaComptesPages';
import ComptaJournalPage from './pages/comptabilite/ComptaJournalPage';
import ComptaEditionPage from './pages/comptabilite/ComptaEditionPage';
import ComptaConfigPage from './pages/comptabilite/ComptaConfigPage';
import ComptaPeriodPage from './pages/comptabilite/ComptaPeriodPage';
import ComptaParametersAva from './pages/comptabilite/ComptaParametresAvances';

import PartnersDashboard from './pages/client_fournisseur/PartnersDashboard';
import PartnerDetailPage from './pages/client_fournisseur/PartnerDetailPage';

import ProductsDashboard from './pages/products/ProductsDashboard';

import SalesDashboard from './pages/ventes/SalesDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Tableau de bord comptable */}
            <Route
              path="/comptabilite"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaDashboard/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Saisie et écritures */}
            <Route
              path="/compta/saisie"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaSaisiePage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Édition des transactions */}
            <Route
              path="/compta/edition"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaEditionPage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/compta/edition/transaction/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaEditionPage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Gestion des comptes */}
            <Route
              path="/compta/comptes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaComptesPages/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Journaux */}
            <Route
              path="/compta/journaux"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaJournalPage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Configuration */}
            <Route
              path="/compta/configuration"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaConfigPage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/compta/configuration/balance"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaConfigPage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/compta/configuration/cloture"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaConfigPage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Périodes */}
            <Route
              path="/compta/parametres/periodes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaPeriodPage/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Paramètres avancés */}
            <Route
              path="/compta/parametres/avances"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaParametersAva/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/compta/parametres"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaParametersAva/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/compta/parametres/rapprocher"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComptaParametersAva/>
                  </Layout>
                </ProtectedRoute>
              }
            />
           
           {/* Clients & Fournisseurs */}
            <Route
             path="/partenaires"
             element={
                <ProtectedRoute>
                 <Layout>
                  <PartnersDashboard />
                 </Layout>
                </ProtectedRoute>
             }
            />

            <Route
             path="/partenaires/:id"
             element={
               <ProtectedRoute>
                 <Layout>
                     <PartnerDetailPage/>
                  </Layout>
               </ProtectedRoute>
             }
            />
           <Route
            path="/produits-tarification"
           element={
             <ProtectedRoute>
               <Layout>
                  <ProductsDashboard />
               </Layout>
            </ProtectedRoute>
            }
          />

          {/* Ventes */}
          <Route
            path="/ventes"
            element={
              <ProtectedRoute>
                 <Layout>
                   <SalesDashboard />
                 </Layout>
              </ProtectedRoute>
            }
          />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;