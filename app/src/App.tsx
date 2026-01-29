import { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { MainLayout } from './components/layout/MainLayout';
import { PhysicalLayer } from './components/physical/PhysicalLayer';
import { UserDashboard } from './components/user/UserDashboard'; // This is now Capital Ledger
import { StrategicCommand } from './components/admin/StrategicCommand'; // This is now Strategic Command

function App() {
  const [currentView, setCurrentView] = useState<'physical' | 'user' | 'admin'>('physical');

  return (
    <SimulationProvider>
      <MainLayout currentView={currentView} onChangeView={setCurrentView}>
        {currentView === 'physical' && <PhysicalLayer currentView={currentView} onChangeView={setCurrentView} />}
        {currentView === 'user' && <UserDashboard currentView={currentView} onChangeView={setCurrentView} />} {/* Renamed visually to Capital Ledger */}
        {currentView === 'admin' && <StrategicCommand currentView={currentView} onChangeView={setCurrentView} />}
      </MainLayout>
    </SimulationProvider>
  );
}

export default App;
