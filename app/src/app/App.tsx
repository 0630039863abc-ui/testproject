import { useState } from 'react';
import { SimulationProvider } from '../entities/Simulation/model/simulationContext';
import { MainLayout } from './layouts/MainLayout';
import { UserDashboard } from '../pages/user/ui/UserPage'; // This is now Capital Ledger
import { StrategicCommand } from '../pages/admin/ui/AdminPage'; // This is now Strategic Command

// --- GLOBAL ERROR BOUNDARY ---
import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

class GlobalErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null, errorInfo: ErrorInfo | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Global Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-8 font-mono text-red-500">
          <div className="border border-red-500/50 bg-red-950/20 p-6 rounded-lg max-w-2xl w-full shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="animate-pulse">⚠️</span> SYSTEM CRITICAL FAILURE
            </h1>
            <div className="bg-black/50 p-4 rounded border border-red-500/30 mb-4 overflow-auto max-h-[60vh]">
              <p className="text-lg font-bold text-white mb-2">{this.state.error?.toString()}</p>
              <pre className="text-xs text-red-400/70 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack || "No stack trace available"}
              </pre>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-red-700">ERROR_CODE: GLOBAL_0xDEAD</span>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors"
              >
                FORCE_REBOOT_SYSTEM
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [currentView, setCurrentView] = useState<'physical' | 'user' | 'admin'>('admin');

  return (
    <GlobalErrorBoundary>
      <SimulationProvider>
        <MainLayout currentView={currentView} onChangeView={setCurrentView}>
          {currentView === 'user' && <UserDashboard currentView={currentView} onChangeView={setCurrentView} />}
          {currentView === 'admin' && <StrategicCommand currentView={currentView} onChangeView={setCurrentView} />}
        </MainLayout>
      </SimulationProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
