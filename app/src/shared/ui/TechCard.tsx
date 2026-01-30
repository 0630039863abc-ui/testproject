import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface TechCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    width?: string;
}

export const TechCard: React.FC<TechCardProps> = ({
    children,
    className,
    width = "w-72",
    ...props
}) => {
    return (
        <motion.div
            className={clsx(
                width,
                "overflow-hidden bg-[#050505]/90 backdrop-blur-md border-l-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]",
                className
            )}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)', ...props.style }}
            {...props}
        >
            {/* Technical Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="p-5 relative">
                {children}
            </div>

            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500/20 clip-path-triangle"></div>
        </motion.div>
    );
};
