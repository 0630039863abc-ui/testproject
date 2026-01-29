import React from 'react';
import { calculateEngagement } from '../../utils/profileAnalytics';
import type { EventLog } from '../../types';
import { Eye, MousePointer, Award, Activity } from 'lucide-react';

interface EngagementBadgesProps {
    logs: EventLog[];
    themeColor: string;
}

export const EngagementBadges: React.FC<EngagementBadgesProps> = ({ logs, themeColor }) => {
    const engagement = calculateEngagement(logs);

    const getIcon = () => {
        switch (engagement.dominantStyle) {
            case 'Observer': return <Eye size={10} />;
            case 'Operator': return <MousePointer size={10} />;
            case 'Vanguard': return <Award size={10} />;
            default: return <Activity size={10} />;
        }
    };

    const getLabel = () => {
        switch (engagement.dominantStyle) {
            case 'Observer': return 'ANALYST'; // Renaming for coolness
            case 'Operator': return 'ACTIVIST';
            case 'Vanguard': return 'PIONEER';
            default: return 'BALANCED';
        }
    };

    return (
        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-sm border border-white/5" style={{ borderColor: `${themeColor}33` }}>
            <div className="text-gray-400" style={{ color: themeColor }}>
                {getIcon()}
            </div>
            <div className="flex flex-col">
                <span className="text-[7px] font-mono uppercase text-gray-500 leading-none">Class</span>
                <span className="text-[9px] font-bold uppercase leading-none tracking-wide text-white">
                    {getLabel()}
                </span>
            </div>
        </div>
    );
};
