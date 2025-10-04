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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;