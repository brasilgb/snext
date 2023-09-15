import React, {PropsWithChildren} from 'react';

interface IconTypeProps {
    width: number;
    height: number;
    color: string;
}

type IconType = (props: IconTypeProps) => JSX.Element;

interface KpiProps {
    label: string;
    value: string;
    bgcolor?: string;
    icon: IconType;
}

const AKpi = ({label, value, bgcolor, icon}: PropsWithChildren<KpiProps>) => {
    return (
        <div className="bg-white flex items-center justify-between rounded-lg shadow p-3">
            <div className="flex-1 flex-col items-center justify-center">
                <h2 className="text-base font-medium text-gray-500 drop-shadow">
                    {label}
                </h2>
                <h1 className="text-xl font-medium text-gray-800 drop-shadow">
                    {value}
                </h1>
            </div>
            <div className="flex items-center">
                <div
                    className={`h-12 w-12 bg-gradient-to-br ${bgcolor} flex items-center justify-center rounded-lg text-white shadow`}
                >
                    {React.createElement(icon, {
                        width: 12,
                        height: 12,
                        color: '#000',
                    })}
                </div>
            </div>
        </div>
    );
};

export default AKpi;
