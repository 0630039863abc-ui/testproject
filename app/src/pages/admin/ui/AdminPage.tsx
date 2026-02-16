import React, { useState, Suspense } from 'react';
import { AppHeader } from '../../../widgets/AppHeader';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { Loading } from '../../../shared/ui/Loading';
import { LayoutShell } from '../../../widgets/LayoutShell';

const StrategicVoronoiMap = React.lazy(() => import('../../../features/AdminDashboard/ui/StrategicVoronoiMap').then(module => ({ default: module.StrategicVoronoiMap })));

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
                <div className="flex-1 w-full p-2 lg:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 lg:gap-4 relative z-10 overflow-y-auto lg:overflow-hidden lg:[grid-template-rows:3fr_1.5fr_1.5fr_1fr]">
                    {/* Voronoi Map — Hero (col 1-8, row 1-3) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-8 lg:row-span-3 h-[50vh] md:h-[55vh] lg:h-auto">
                        <StrategicVoronoiMap />
                    </div>

                    {/* Activity Matrix (col 9-12, row 1-2) */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-2 h-[280px] lg:h-auto">
                        <LiveOccupancy />
                    </div>

                    {/* Telemetry Stream (col 9-12, row 3) */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1 h-[280px] lg:h-auto flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
                        <TelemetryTableModule
                            recentLogs={logs.slice(0, 15)}
                            selectedRowId={selectedRowId}
                            onSelect={setSelectedRowId}
                        />
                    </div>

                    {/* Demographic Matrix (col 1-12, row 4) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-12 h-[250px] lg:h-auto">
                        <DemographicMatrix />
                    </div>
                </div>
            </Suspense>
        </LayoutShell>
    );
};
