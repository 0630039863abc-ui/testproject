import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OdometerCounterProps {
    value: number;
    className?: string;
}

export const OdometerCounter: React.FC<OdometerCounterProps> = ({ value, className }) => {
    return (
        <div className={`flex overflow-hidden ${className}`}>
            {value.toString().split('').map((digit, i) => (
                <Digit key={i} digit={digit} />
            ))}
        </div>
    );
};

const Digit = ({ digit }: { digit: string }) => {
    const [prevDigit, setPrevDigit] = useState(digit);

    useEffect(() => {
        if (digit !== prevDigit) {
            setPrevDigit(digit);
        }
    }, [digit]);

    return (
        <div className="relative h-[1em] w-[0.6em] flex justify-center">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={digit}
                    initial={{ y: '100%', opacity: 0, filter: 'blur(2px)' }}
                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-100%', opacity: 0, filter: 'blur(2px)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute"
                >
                    {digit}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};
