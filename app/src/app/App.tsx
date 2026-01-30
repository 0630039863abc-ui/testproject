import { useState } from 'react';
import { SimulationProvider } from '../entities/Simulation/model/simulationContext';
import { MainLayout } from './layouts/MainLayout';
import { PhysicalLayer } from '../pages/physical/ui/PhysicalPage';
import { UserDashboard } from '../pages/user/ui/UserPage'; // This is now Capital Ledger
import { StrategicCommand } from '../pages/admin/ui/AdminPage'; // This is now Strategic Command

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
