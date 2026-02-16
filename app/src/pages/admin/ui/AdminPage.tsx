import React, { useState, Suspense } from 'react';
import { AppHeader } from '../../../widgets/AppHeader';
import { useSimulation } from '../../../entities/Simulation/model/simulationContext';
import { LayoutGroup, motion } from 'framer-motion';
import { Loading } from '../../../shared/ui/Loading';
import { LayoutShell } from '../../../widgets/LayoutShell';

const StrategicVoronoiMap = React.lazy(() => import('../../../features/AdminDashboard/ui/StrategicVoronoiMap').then(module => ({ default: module.StrategicVoronoiMap })));
const KPIBento = React.lazy(() => import('../../../features/AdminDashboard/ui/KPIBento').then(module => ({ default: module.KPIBento })));
const LiveOccupancy = React.lazy(() => import('../../../features/AdminDashboard/ui/LiveOccupancy').then(module => ({ default: module.LiveOccupancy })));
const TelemetryTableModule = React.lazy(() => import('../../../features/Telemetry/ui/TelemetryStream').then(module => ({ default: module.TelemetryTableModule })));

interface StrategicCommandProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
}

export const StrategicCommand: React.FC<StrategicCommandProps> = ({ currentView, onChangeView }) => {
    const { logs } = useSimulation();
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    return (
        <LayoutGroup>
            <LayoutShell>
                {/* Global Header */}
                <AppHeader currentView={currentView} onChangeView={onChangeView} />

                <Suspense fallback={<Loading />}>
                    <div className="flex-1 w-full p-6 grid grid-cols-12 grid-rows-12 gap-6 relative z-10 overflow-hidden">

                        {/* Block 1: Main Strategic Voronoi Map (Top/Center Left - Spans 8 cols, 8 rows) */}
                        <motion.div
                            layout
                            className="col-span-8 row-span-8 relative"
                        >
                            <StrategicVoronoiMap />
                        </motion.div>

                        {/* Right Analytical Panel (Column 3 - Spans 4 cols, 12 rows) */}
                        <div className="col-span-4 row-span-12 flex flex-col gap-6 h-full">

                            {/* Block 2: Live Occupancy */}
                            <motion.div layout className="flex-none">
                                <LiveOccupancy />
                            </motion.div>

                            {/* Predictive Analytics: Telemetry Stream */}
                            <div className="flex-1 min-h-0 glass-card border border-prism/10 rounded-sm overflow-hidden flex flex-col relative group/stream shadow-2xl">
                                <div className="absolute inset-0 bg-void/20 pointer-events-none" />
                                <TelemetryTableModule
                                    recentLogs={logs.slice(0, 15)}
                                    selectedRowId={selectedRowId}
                                    onSelect={setSelectedRowId}
                                />
                            </div>
                        </div>

                        {/* Block 3: Bottom Panel (Spans 8 cols, 4 rows) */}
                        <motion.div
                            layout
                            className="col-span-8 row-span-4"
                        >
                            <KPIBento />
                        </motion.div>
                    </div>
                </Suspense>
            </LayoutShell>
        </LayoutGroup>
    );
};
