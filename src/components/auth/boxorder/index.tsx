import Link from 'next/link';
import React from 'react';
import {FaArrowCircleDown, FaArrowCircleRight, FaTools} from 'react-icons/fa';

interface BoxProps {
    ordens: any;
    query: any;
    title: string;
    iconColor: string;
    titleColor: string;
}

const Boxorder = ({ordens, query, title, iconColor, titleColor}: BoxProps) => {
    return (
        <div className="bg-white flex-col items-center justify-between rounded-lg shadow p-3">
            <div className="pb-2 flex items-center justify-start">
                <FaTools size={14} color={iconColor} />
                <h1 className={`text-base ${titleColor} font-semibold ml-2`}>
                    {title}
                </h1>
            </div>
            <div className="py-2">
                <div className="flex items-center justify-start border-b">
                    <div className="mr-2">
                        <FaArrowCircleDown size={14} color="#666" />
                    </div>
                    <div className="flex-1 text-base text-gray-600 font-semibold">
                        Nome
                    </div>
                    <div className="w-28 text-base text-gray-600 font-semibold">
                        Nº Ordem
                    </div>
                    <div className="w-28 text-base text-gray-600 font-semibold">
                        Dispositivo
                    </div>
                </div>
                <div className="h-60 overflow-auto">
                    {ordens.filter(query).map((ordem: any, idx: any) => (
                        <Link key={idx} href={`/ordens/editar/${ordem.id}`}>
                            <div
                                key={idx}
                                className="flex items-center justify-start border-b border-b-gray-200 py-1"
                            >
                                <div className="mr-2">
                                    <FaArrowCircleRight
                                        size={14}
                                        color={iconColor}
                                    />
                                </div>
                                <div className="flex-1 text-sm text-gray-500">
                                    {ordem.cliente.nome}
                                </div>
                                <div className="w-28 text-sm text-gray-500">
                                    {('000000' + ordem.id).slice(-6)}
                                </div>
                                <div className="w-28 text-sm text-gray-500">
                                    {ordem.equipamento}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Boxorder;
