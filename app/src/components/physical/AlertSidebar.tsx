import React, { useState, useEffect } from 'react';

export const AlertSidebar: React.FC = () => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const messages = [
            "SYNC_INITIALIZED",
            "CORE_READY",
            "PACKET_REC_0x442",
            "BUFFER_FLUSH_OK",
            "LATENCY_NOMINAL",
            "LINK_ESTABLISHED",
            "NODE_HEARTBEAT_ACK",
            "ENCRYPTION_LAYER_SEC",
            "SIGNAL_REBOUND_FIX",
            "TELEMETRY_STREAM_UP"
        ];

        const interval = setInterval(() => {
            const newLine = messages[Math.floor(Math.random() * messages.length)];
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLines(prev => [`[${time}] ${newLine}`, ...prev].slice(0, 25));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-1 p-3 bg-black/20 backdrop-blur-sm border-l border-blue-500/10 h-full w-[220px] overflow-hidden">
            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-2">
                System Raw Logs
            </div>
            <div className="flex flex-col gap-0.5 font-mono text-[8px] leading-tight">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className={`truncate ${i === 0 ? 'text-blue-400 animate-pulse' : 'text-white/30'} ${line.includes('ERR') ? 'text-red-500' : ''}`}
                    >
                        {line}
                    </div>
                ))}
            </div>

            {/* Background Decorative Text */}
            <div className="absolute bottom-4 left-3 opacity-10 pointer-events-none select-none">
                <pre className="text-[6px] text-blue-500">
                    {`
01010111 01001000
01001001 01010100
01000101 00100000
01010010 01000001
01000010 01000010
01001001 01010100
                    `}
                </pre>
            </div>
        </div>
    );
};
