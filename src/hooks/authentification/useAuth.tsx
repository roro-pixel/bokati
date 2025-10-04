import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { AuthState, AuthContextType, LoginCredentials, AuthUser } from '../../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données mockées pour la démonstration
const mockUsers: AuthUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@kerservice.cg',
    role: 'ADMIN',
    entity: '001',
    isActive: true,
    firstName: 'Raphaël',
    lastName: 'SOGNELE',
    phone: '+242 06 493 06 42',
    department: 'Direction',
    lastLogin: new Date('2025-08-20'),
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    username: 'comptable',
    email: 'comptable@kerservice.cg',
    role: 'COMPTABLE',
    entity: '001',
    isActive: true,
    firstName: 'Joël',
    lastName: 'BIKINDOU',
    phone: '+242 06 695 04 31',
    department: 'Comptabilité',
    lastLogin: new Date('2025-08-20'),
    createdAt: new Date('2025-01-01'),
  },
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('authUser');

        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers.find(u => 
        u.username === credentials.username && 
        credentials.password === 'password' // Mot de passe mocké
      );

      if (!user) {
        throw new Error('Identifiants invalides');
      }

      if (!user.isActive) {
        throw new Error('Compte désactivé');
      }

      // Simuler un token JWT
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
        userId: user.id,
        username: user.username,
        role: user.role
      }))}.mock-signature`;

      // Mettre à jour le lastLogin
      const updatedUser = { ...user, lastLogin: new Date() };

      // Stocker dans le localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));

      setAuthState({
        user: updatedUser,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = (): void => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};