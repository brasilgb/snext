import React from 'react';

interface TableProps {
    children: React.ReactNode;
    head?: boolean;
    line?: number;
    lineDeleted?: boolean;
}

export const ATable = ({children}: TableProps) => {
    return (
        <div className="border border-gray-200 rounded">
            <table className="w-full">{children}</table>
        </div>
    );
};

export const ATr = ({children, head, line, lineDeleted}: TableProps) => {
    return (
        <>
            {head ? (
                <thead>
                    <tr className={`bg-gray-100 border-b border-b-gray-200`}>
                        {children}
                    </tr>
                </thead>
            ) : (
                <tbody>
                    <tr
                        className={`${
                            lineDeleted
                                ? 'bg-terciary-yellow text-primary-red'
                                : line
                                ? 'bg-slate-50 text-gray-500'
                                : 'bg-white text-gray-500'
                        } transition-all duration-300 hover:bg-gray-100 border-b border-b-gray-100`}
                    >
                        {children}
                    </tr>
                </tbody>
            )}
        </>
    );
};

export const ATh = ({children}: TableProps) => {
    return (
        <th className="text-left text-base text-gray-600 p-2">{children}</th>
    );
};

export const ATd = ({children, lineDeleted}: TableProps) => {
    return (
        <td className={`text-left text-base font-normal  pl-2 py-1`}>
            {children}
        </td>
    );
};
