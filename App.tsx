import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { NewJob } from './screens/NewJob';
import { Queue } from './screens/Queue';
import { Reports } from './screens/Reports';
import { Customers } from './screens/Customers';
import { Expenses } from './screens/Expenses';
import { Settings } from './screens/Settings';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard />;
      case 'new-job': return <NewJob />;
      case 'queue': return <Queue />;
      case 'reports': return <Reports />;
      case 'customers': return <Customers />;
      case 'expenses': return <Expenses />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderScreen()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;