import React from 'react';

interface BoxProps {
    children: React.ReactNode;
}

export const ABoxAll = ({children}: BoxProps) => {
    return (
        <div className="border border-gray-50 bg-white shadow rounded-lg p-4">
            {children}
        </div>
    );
};

export const ABoxHeader = ({children}: BoxProps) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-50 bg-white pb-4">
            {children}
        </div>
    );
};

export const ABoxContent = ({children}: BoxProps) => {
    return <div className="border border-gray-50 bg-white">{children}</div>;
};

export const ABoxFooter = ({children}: BoxProps) => {
    return (
        <div className="border-t border-gray-50 bg-white pt-4">{children}</div>
    );
};
