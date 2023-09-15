'use client';
import {useAuthContext} from '@/contexts/auth';
import sosapi from '@/services/sosapi';
import {cnpj} from 'cpf-cnpj-validator';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import {HiOutlineScissors} from 'react-icons/hi2';
import Image from 'next/image';

const PrintRecibo = ({value}: any) => {
    const {user} = useAuthContext();
    const [ordens, setOrdens] = useState<any>([]);
    const [empresas, setEmpresas] = useState<any>([]);
    const [impressoes, setImpressoes] = useState<any>([]);
    moment.locale('pt-br');

    const renderHTML = (rawHTML: string) =>
        React.createElement('div', {
            dangerouslySetInnerHTML: {__html: rawHTML},
        });

    useEffect(() => {
        const getEmpresas = async () => {
            await sosapi
                .get(`empresa`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then(response => {
                    setEmpresas(response.data.data[0]);
                })
                .catch(err => {
                    // console.log(err);
                });
        };
        getEmpresas();
    }, [user]);

    useEffect(() => {
        const getOrdens = async () => {
            await sosapi
                .get(`ordens/${value}`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then(response => {
                    setOrdens(response.data.data);
                })
                .catch(err => {
                    // console.log(err);
                });
        };
        getOrdens();
    }, [user, value]);

    useEffect(() => {
        const getImpressoes = async () => {
            await sosapi
                .get(`impressoes`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then(response => {
                    setImpressoes(response.data.data[0]);
                })
                .catch(err => {
                    // console.log(err);
                });
        };
        getImpressoes();
    }, [user]);

    const CabecalhoRecibo = () => {
        return (
            <div className="flex items-center justify-start border-b border-gray-300 pb-2">
                <div className="flex-none flex items-center justify-start">
                    <div className="w-16">
                        <Image
                            src={empresas.logo?`${process.env.NEXT_PUBLIC_SITE_URL}/storage/uploads/${empresas.logo}`: './notimage.jpg'}
                            alt="logo"
                            className='w-16 h-16'
                            width={64}
                            height={64}
                        />
                    </div>
                    <div className="pl-4">
                        <h1 className="text-xs font-medium">
                            {empresas.empresa}
                        </h1>
                    </div>
                </div>
                <div className="flex-1 flex-col items-center justify-center">
                    <h1 className="text-center text-xs font-medium">
                        {cnpj.format(empresas.cnpj)} - {empresas.endereco} -{' '}
                        {empresas.bairro}
                    </h1>
                    <h1 className="text-center text-xs font-medium">
                        {empresas.cidade} - {empresas.email} -{' '}
                        {empresas.telefone}
                    </h1>
                </div>
            </div>
        );
    };

    const CorpoRecibo = () => {
        return (
            <>
                <div className="mt-2 mb-2 border-b flex items-center justify-start">
                    <h1 className="tx-lg">Ordem de serviço N°:</h1>{' '}
                    <span className="text-xl ml-2 font-semibold text-primary-blue">
                        {('0000000' + ordens?.id).slice(-7)}
                    </span>
                </div>
                <div className="flex items-start justify-start">
                    <div className="flex-1 flex-col items-start justify-start">
                        <h1 className="text-xs font-normal">
                            Cliente:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {ordens?.cliente?.nome}
                            </span>
                        </h1>
                        <h1 className="text-xs font-normal">
                            Telefone:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {ordens?.cliente?.telefone}
                            </span>{' '}
                        </h1>
                        <h1 className="text-xs font-normal">
                            E-mail:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {ordens?.cliente?.email}
                            </span>{' '}
                        </h1>
                        <h1 className="text-xs font-normal">
                            Endereço:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {ordens?.cliente?.endereco}
                            </span>{' '}
                        </h1>
                    </div>
                    <div className="flex-1 flex-col items-start justify-start">
                        <h1 className="text-xs font-normal">
                            Entrada:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {moment(ordens?.dtentrada).format('DD/MM/YYYY')}
                            </span>{' '}
                        </h1>
                        <h1 className="text-xs font-normal">
                            Bairro:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {ordens?.cliente?.bairro}
                            </span>{' '}
                        </h1>
                        <h1 className="text-xs font-normal">
                            Cidade:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {ordens?.cliente?.cidade}
                            </span>{' '}
                        </h1>
                        <h1 className="text-xs font-normal">
                            Estado:{' '}
                            <span className="ml-2 text-xs font-medium">
                                {ordens?.cliente?.uf}
                            </span>{' '}
                        </h1>
                    </div>
                </div>
                <div className="pt-1 pl-2 mt-2 bg-gray-300">
                    <h1 className="text-base font-semibold">
                        Serviços solicitados
                    </h1>
                </div>
                <div className="py-2 pl-2 text-xs bg-gray-200">
                    {ordens.detalhes}
                </div>
                <div className="my-2 text-xs pt-2 border-t leading-5">
                    {renderHTML(impressoes.entrada)}
                </div>
                <div className="flex text-xs items-baseline justify-start">
                    <h1>{ordens?.cliente?.nome}</h1>{' '}
                    <div className="border-b border-gray-700 w-60 ml-1" />
                </div>
                <div className="mt-2 text-xs">
                    {empresas.cidade + ', ' + moment().format('LL')}.
                </div>
            </>
        );
    };

    const ReciboEntrega = () => {
        return (
            <>
                <div className="flex items-start justify-start border-b mt-6">
                    <div className="flex-1 flex-col items-start justify-start">
                        <h1 className="text-lg">Recibo de saída</h1>
                    </div>
                    <div className="flex-1 border-b flex items-center justify-start">
                        <h1 className="tx-lg">Ordem de serviço N°:</h1>{' '}
                        <span className="text-lg ml-2 font-semibold text-primary-blue">
                            {('0000000' + ordens?.id).slice(-7)}
                        </span>
                    </div>
                    <div className="flex-1 flex-col items-start justify-start">
                        <h1 className="text-lg font-normal">
                            Valor total:{' '}
                            <span className="ml-2 text-lg font-semibold text-primary-blue">
                                {ordens?.custo}
                            </span>{' '}
                        </h1>
                    </div>
                </div>

                <div className="my-4 text-xs">
                    Recebi(emos) de {ordens.cliente.nome} a quantia de
                    Quatrocentos e Setenta e Oito Reais , correspondente a{' '}
                    {ordens.detalhes}, para clareza firmo o pesente.
                </div>
                <div className="text-xs">
                    {empresas.cidade + ', ' + moment().format('LL')}.
                </div>
                <div className="mt-6 flex items-baseline justify-end">
                    <h1>Assinatura</h1>{' '}
                    <div className="border-b border-gray-400 border-dashed w-60 ml-1" />
                </div>
            </>
        );
    };

    return (
        <div className="w-full p-4">
            {ordens.status === 3 || ordens.status === 7 ? (
                <>
                    <CabecalhoRecibo />
                    <ReciboEntrega />
                </>
            ) : (
                <>
                    <CabecalhoRecibo />
                    <CorpoRecibo />
                    <div className="border-b border-gray-400 border-dashed my-6 relative">
                        {' '}
                        <HiOutlineScissors
                            size={18}
                            className="absolute -top-2 ml-8"
                        />{' '}
                    </div>
                    <CabecalhoRecibo />
                    <CorpoRecibo />
                </>
            )}
        </div>
    );
};

export default PrintRecibo;
