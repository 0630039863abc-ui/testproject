import React from 'react';
import type { ClusterMetrics as ClusterMetricsType } from '../../../types';
import { CLUSTER_COLORS, CLUSTER_TRANSLATIONS } from '../../../shared/lib/tokens';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import clsx from 'clsx';

interface ClusterMetricsProps {
    metrics: ClusterMetricsType;
    showAnomalies: boolean;
    onToggleAnomalies: () => void;
}

export const ClusterMetrics: React.FC<ClusterMetricsProps> = ({ metrics, showAnomalies, onToggleAnomalies }) => {
    // Simulated trend data based on current metric
    const data = Array.from({ length: 10 }).map((_, i) => ({
        name: `T - ${10 - i} `,
        value: metrics.activeUnits + Math.sin(i) * 10 + (Math.random() * 5)
    }));

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">{CLUSTER_TRANSLATIONS[metrics.name] || metrics.name} Кластер</h2>
                <div className="flex gap-2">
                    <button
                        onClick={onToggleAnomalies}
                        className={clsx(
                            "px-4 py-2 rounded-lg border transition-all flex items-center gap-2",
                            showAnomalies
                                ? "bg-red-500/20 text-red-400 border-red-500/50"
                                : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                        )}
                    >
                        <AlertTriangle size={16} />
                        {showAnomalies ? "Скрыть Аномалии" : "Показать Аномалии"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Users size={16} />
                        <span>Активные Юниты</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{metrics.activeUnits}</span>
                    <span className="text-green-400 text-xs ml-2">+12%</span>
                </div>

                <div className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Target size={16} />
                        <span>Покрытие</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{metrics.coveragePercent}%</span>
                </div>

                <div className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <TrendingUp size={16} />
                        <span>Индекс ROI</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-400">{metrics.roi.toFixed(2)}x</span>
                </div>

                <div className={clsx("glass-panel p-4 rounded-xl border transition-colors", metrics.anomalies > 5 ? "border-red-500/50 bg-red-900/10" : "")}>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <AlertTriangle size={16} className={metrics.anomalies > 5 ? "text-red-500" : ""} />
                        <span>Аномалии</span>
                    </div>
                    <span className={clsx("text-2xl font-bold", metrics.anomalies > 5 ? "text-red-500" : "text-white")}>
                        {metrics.anomalies}
                    </span>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col">
                <h3 className="text-white font-bold mb-4">Рост Компетенции vs Стоимость</h3>
                <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" tick={{ fill: '#666' }} />
                            <YAxis tick={{ fill: '#666' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};
