import React, { useState, Suspense } from 'react';
import { AppHeader } from '../../../widgets/AppHeader';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { Loading } from '../../../shared/ui/Loading';
import { LayoutShell } from '../../../widgets/LayoutShell';

const StrategicVoronoiMap = React.lazy(() => import('../../../features/AdminDashboard/ui/StrategicVoronoiMap').then(module => ({ default: module.StrategicVoronoiMap })));
const KPIBento = React.lazy(() => import('../../../features/AdminDashboard/ui/KPIBento').then(module => ({ default: module.KPIBento })));
const LiveOccupancy = React.lazy(() => import('../../../features/AdminDashboard/ui/LiveOccupancy').then(module => ({ default: module.LiveOccupancy })));
const TelemetryTableModule = React.lazy(() => import('../../../features/Telemetry/ui/TelemetryStream').then(module => ({ default: module.TelemetryTableModule })));
const DemographicMatrix = React.lazy(() => import('../../../features/AdminDashboard/ui/DemographicMatrix').then(module => ({ default: module.DemographicMatrix })));

interface StrategicCommandProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const StrategicCommand: React.FC<StrategicCommandProps> = ({ currentView, onChangeView }) => {
    const { logs } = useSimulation();
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    return (
        <LayoutShell>
            <AppHeader currentView={currentView} onChangeView={onChangeView} />

            <Suspense fallback={<Loading />}>
                <div
                    className="flex-1 w-full p-4 grid grid-cols-12 gap-4 relative z-10 overflow-hidden"
                    style={{ gridTemplateRows: '2fr 1fr 1fr 1.5fr' }}
                >
                    {/* Voronoi Map — Hero (col 1-8, row 1-3) */}
                    <div className="col-span-8 row-span-3">
                        <StrategicVoronoiMap />
                    </div>

                    {/* Activity Matrix (col 9-12, row 1-2) */}
                    <div className="col-span-4 row-span-2">
                        <LiveOccupancy />
                    </div>

                    {/* Telemetry Stream (col 9-12, row 3) */}
                    <div className="col-span-4 row-span-1 flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
                        <TelemetryTableModule
                            recentLogs={logs.slice(0, 15)}
                            selectedRowId={selectedRowId}
                            onSelect={setSelectedRowId}
                        />
                    </div>

                    {/* Rating (col 1-4, row 4) */}
                    <div className="col-span-4">
                        <KPIBento />
                    </div>

                    {/* Demographic Matrix (col 5-12, row 4) */}
                    <div className="col-span-8">
                        <DemographicMatrix />
                    </div>
                </div>
            </Suspense>
        </LayoutShell>
    );
};
