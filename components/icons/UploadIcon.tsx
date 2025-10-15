
import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V8.25c0-1.12 0.93-2.02 2.08-1.93l11.45 1.05c1.1.1 1.97.99 1.97 2.09v7.02c0 1.1-.87 2-1.97 2.09l-11.45 .92c-1.15.09-2.08-.8-2.08-1.93z" 
        />
    </svg>
);
