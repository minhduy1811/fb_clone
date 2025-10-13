'use client'

import { useState, useEffect } from 'react';

interface CountdownProps {
    initialSeconds: number;
    onComplete: () => void;
    onReset?: () => void;
}

export const Countdown = ({ initialSeconds, onComplete, onReset }: CountdownProps) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        setIsActive(false);
                        onComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, onComplete]);

    const handleReset = () => {
        setSeconds(initialSeconds);
        setIsActive(true);
        onReset?.();
    };

    const formatTime = (secs: number): string => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    if (seconds === 0) {
        return (
            <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
                Gửi lại mã
            </button>
        );
    }

    return (
        <p className="text-sm text-muted-foreground">
            Mã OTP sẽ hết hạn sau: <span className="font-medium text-foreground">{formatTime(seconds)}</span>
        </p>
    );
};