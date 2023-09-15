// const CliEditar = ({ params }: { params: { id: number } }) => {
'use client';
import React, {useEffect, useState, useCallback} from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import {AButtomBack} from '@/components/auth/buttons';
import {Field, Form, Formik} from 'formik';
import {IoSave} from 'react-icons/io5';
import {maskDate} from '@/utils';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import {CgSpinnerTwo} from 'react-icons/cg';
import moment from 'moment';
import {editOrdem} from '../schema';
import {useAuthContext} from '@/contexts/auth';
import { useSearchParams } from 'next/navigation';

interface FormProps {
    numordem: string;
    idcliente: string;
    equipamento: string;
    modelo: string;
    senha: string;
    defeito: string;
    estado: string;
    acessorios: string;
    previsao: string;
    orcamento: any;
    descorcamento: string;
    pecas: any;
    valpecas: string;
    valservico: string;
    custo: number;
    tecnico: string;
    status: any;
    envioemail: boolean;
    detalhes: string;
    dtentrega: any;
    observacoes: string;
}

const OrdEditar = () => {
    const {user, logout} = useAuthContext();
    const [ordens, setOrdens] = useState<any>([]);
    const [tecnicos, setTecnicos] = useState<any>([]);
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [nomeCliente, setNomeCliente] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const params = searchParams.get('q');
    useEffect(() => {
        const getOrdens = async () => {
            await sosapi
                .get(`ordens/${params}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const { data, token } = response.data;
                    if (!token) {
                        logout(user.token);
                        return;
                    }
                    setOrdens(data);
                    setNomeCliente(data.cliente.nome);
                })
                .catch(err => {
                    // logout(user.token);
                });
        };
        getOrdens();
    }, [params, user, logout]);

    useEffect(() => {
        const getTecnicos = async () => {
            await sosapi
                .get(`users`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const { data, token } = response.data;
                    if (!token) {
                        logout(user.token);
                        return;
                    }
                    setTecnicos(
                        data.filter((tecnico: any) => tecnico.function === 3),
                    );
                })
                .catch(err => {
                    // logout(user.token);
                });
        };
        getTecnicos();
    }, [params, user, logout]);

    const handleSubmitForm = useCallback(
        async (values: FormProps) => {
            setLoading(true);
            let dtformat: any = maskDate(values.previsao);
            let formatedDate =
                dtformat?.split('/')[2] +
                dtformat?.split('/')[1] +
                dtformat?.split('/')[0];

            const response = await sosapi.patch(
                `ordens/${params}`,
                {
                    cliente_id: values.idcliente,
                    numordem: values.numordem,
                    equipamento: values.equipamento,
                    modelo: values.modelo,
                    senha: values.senha,
                    defeito: values.defeito,
                    estado: values.estado,
                    acessorios: values.acessorios,
                    previsao: moment(formatedDate).format('YYYY-MM-DD'),
                    orcamento: values.orcamento,
                    descorcamento: values.descorcamento,
                    pecas: values.pecas,
                    valpecas: values.valpecas,
                    valservico: values.valservico,
                    custo: values.custo,
                    status: values.status,
                    tecnico: values.tecnico,
                    envioemail: values.envioemail,
                    detalhes: values.detalhes,
                    dtentrega:
                        values.status === 7 ? moment() : values.dtentrega,
                    observacoes: values.observacoes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            const {message, status, data, token} = response.data;
                    if (!token) {
                        logout(user.token);
                        return;
                    }
            if (status === 200) {
                setLoading(false);
                setOrdens(data);
                setMessage(message);
            } else {
                setMessage(message);
            }
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        },
        [params, user],
    );

    const statOrdens = [
        {
            value: 1,
            label: 'Ordem aberta',
        },
        {
            value: 2,
            label: 'Aguardando Avaliação',
        },
        {
            value: 3,
            label: 'Ordem fechada',
        },
        {
            value: 4,
            label: 'Executando reparo',
        },
        {
            value: 5,
            label: '(CN)Serviço concluído', // cliente não avisado
        },
        {
            value: 6,
            label: '(CA)Serviço concluído', // cliente avisado
        },
        {
            value: 7,
            label: 'Entregue ao cliente',
        },
    ];

    const orcamentos = [
        {
            value: 1,
            label: 'Gearado',
        },
        {
            value: 2,
            label: 'Aprovado',
        },
    ];

    return (
        <>
            {showMessage && (
                <AMessage
                    showmessage={() => setShowMessage(false)}
                    message={message}
                />
            )}
            <ABoxAll>
                <ABoxHeader>
                    <div>
                        <AButtomBack url="/ordens" />
                    </div>
                </ABoxHeader>

                <Formik
                    validationSchema={editOrdem}
                    enableReinitialize
                    initialValues={{
                        numordem: ordens.id,
                        idcliente: ordens.cliente_id,
                        equipamento: ordens.equipamento,
                        modelo: ordens.modelo,
                        senha: ordens.senha,
                        defeito: ordens.defeito,
                        estado: ordens.estado,
                        acessorios: ordens.acessorios,
                        previsao: moment(ordens.previsao).format('DDMMYYYY'),
                        orcamento: ordens.orcamento,
                        descorcamento: ordens.descorcamento
                            ? ordens.descorcamento
                            : '',
                        pecas: ordens.pecas ? ordens.pecas : '',
                        valpecas: ordens.valservico ? ordens.valservico : 0,
                        detalhes: ordens.detalhes,
                        valservico: ordens.valservico ? ordens.valservico : 0,
                        custo: ordens.custo,
                        status: ordens.status,
                        tecnico: ordens.tecnico,
                        envioemail: ordens.envioemail ? true : false,
                        dtentrega: ordens.dtentrada,
                        observacoes: ordens.observacoes,
                    }}
                    onSubmit={handleSubmitForm}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        setTouched,
                        handleSubmit,
                        isValid,
                    }) => (
                        <>
                            <Form onSubmit={handleSubmit} autoComplete="off">
                                <Field
                                    type="hidden"
                                    name="idcliente"
                                    id="idcliente"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.idcliente}
                                    autoFocus
                                />
                                <ABoxContent>
                                    <div className="mt-4 px-2">
                                        <div className="md:grid md:grid-cols-5 md:gap-x-6">
                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="numordem"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Nº. Ordem
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow bg-gray-100 border-2 border-white rounded-md focus:ring-0 focus:border-white px-4 py-2.5 text-base text-gray-400 font-medium"
                                                        type="text"
                                                        name="numordem"
                                                        id="numordem"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.numordem}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 mb-4 md:mb-6">
                                                <label
                                                    htmlFor="client_id"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Nome do cliente
                                                </label>
                                                <div className="w-full relative">
                                                    <div className="w-full relative">
                                                        <Field
                                                            className="w-full shadow bg-gray-100 border-2 border-white rounded-md focus:ring-0 focus:border-white px-4 py-2.5 text-base text-gray-400 font-medium"
                                                            type="text"
                                                            name="cliente"
                                                            id="cliente"
                                                            value={nomeCliente}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 mb-4 md:mb-6">
                                                <label
                                                    htmlFor="equipamento"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Tipo de equipamento
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        type="text"
                                                        name="equipamento"
                                                        id="equipamento"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            values.equipamento
                                                        }
                                                        placeholder="PC, Tablet, Smartphone, Impressora, etc..."
                                                        title="Digite o equipamento"
                                                    />
                                                    {errors.equipamento &&
                                                        touched.equipamento && (
                                                            <div className="text-sm text-secundary-red pl-1 pt-1">
                                                                {
                                                                    errors.equipamento
                                                                }
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:grid md:grid-cols-7 md:gap-x-6">
                                            <div className="md:col-span-3 mb-4 md:mb-6">
                                                <label
                                                    htmlFor="modelo"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Modelo do equipamento
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        type="text"
                                                        name="modelo"
                                                        id="modelo"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.modelo}
                                                        title="Digite o modelo"
                                                    />
                                                    {errors.modelo &&
                                                        touched.modelo && (
                                                            <div className="text-sm text-secundary-red pl-1 pt-1">
                                                                {errors.modelo}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 mb-4 md:mb-6">
                                                <label
                                                    htmlFor="senha"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Senha caso haja
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        type="text"
                                                        name="senha"
                                                        id="senha"
                                                        maxLength={9}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.senha}
                                                        placeholder="Senha caso haja. Digite n/a se não houver"
                                                        title="Digite o senha"
                                                    />
                                                    {errors.senha &&
                                                        touched.senha && (
                                                            <div className="text-sm text-secundary-red pl-1 pt-1">
                                                                {errors.senha}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 mb-4 md:mb-6">
                                                <label
                                                    htmlFor="previsao"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Previsão de entrega
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        type="text"
                                                        name="previsao"
                                                        id="previsao"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={maskDate(
                                                            values.previsao,
                                                        )}
                                                        title="Digite a data de previsao"
                                                        placeholder="__/__/____"
                                                        maxlength={8}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:grid md:grid-cols-3 md:gap-x-6">
                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="defeito"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Defeito relatado/Serviço solicitado
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        as="textarea"
                                                        rows={2}
                                                        name="defeito"
                                                        id="defeito"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.defeito}
                                                        title="Digite o defeito"
                                                    />
                                                    {errors.defeito &&
                                                        touched.defeito && (
                                                            <div className="text-sm text-secundary-red pl-1 pt-1">
                                                                {errors.defeito}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="estado"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Estado do equipamento
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        as="textarea"
                                                        rows={2}
                                                        name="estado"
                                                        id="estado"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.estado}
                                                        placeholder="Arranhado, Amassado, Vazando, Quebrado, etc..."
                                                        title="Digite o endereço"
                                                    />
                                                    {errors.estado &&
                                                        touched.estado && (
                                                            <div className="text-sm text-secundary-red pl-1 pt-1">
                                                                {errors.estado}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="acessorios"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Acessórios do equipamento
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        as="textarea"
                                                        rows={2}
                                                        name="acessorios"
                                                        id="acessorios"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            values.acessorios
                                                        }
                                                        placeholder="Case, Carregador, Pendrivers, Cabos, etc..."
                                                        title="Digite o acessorios"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-b border-gray-300 mb-6">
                                            <h1 className="text-lg text-primary-blue font-semibold">
                                                Orçamento
                                            </h1>
                                        </div>

                                        <div className="md:grid md:grid-cols-3 md:gap-x-6">
                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="orcamento"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Situação do orçamento
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        as="select"
                                                        placeholder="Selecione o status"
                                                        className="shadow w-full placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        name="orcamento"
                                                        id="orcamento"
                                                        value={values.orcamento}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        <option value="">
                                                            Selecione a situação
                                                        </option>
                                                        {orcamentos.map(
                                                            (
                                                                orcamento,
                                                                idx,
                                                            ) => (
                                                                <option
                                                                    key={idx}
                                                                    value={
                                                                        orcamento.value
                                                                    }
                                                                >
                                                                    {
                                                                        orcamento.label
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>

                                            <div className="col-span-2 mb-4 md:mb-6">
                                                <label
                                                    htmlFor="descorcamento"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Descrição do orçamento
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        as="textarea"
                                                        rows={1}
                                                        name="descorcamento"
                                                        id="descorcamento"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            values.descorcamento
                                                        }
                                                        placeholder=""
                                                        title="Digite o descrição"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-b border-gray-300 my-6" />

                                        <div className="md:grid md:grid-cols-5 md:gap-x-6">
                                            <div className="col-span-2 mb-4 md:mb-6">
                                                <label
                                                    htmlFor="pecas"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Peças adicionadas
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        as="textarea"
                                                        rows={1}
                                                        name="pecas"
                                                        id="pecas"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.pecas}
                                                        title="Digite o pecas"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="valpecas"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Valor das peças
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        type="text"
                                                        name="valpecas"
                                                        id="valpecas"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.valpecas}
                                                        placeholder=""
                                                        title="Valor das pecas"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="valservico"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Valor do serviço
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        type="text"
                                                        name="valservico"
                                                        id="valservico"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            values.valservico
                                                        }
                                                        title="Digite o valor do serviço"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="valservico"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Custo total
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        type="text"
                                                        name="custo"
                                                        id="custo"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            (values.custo =
                                                                parseFloat(
                                                                    values.valpecas,
                                                                ) +
                                                                parseFloat(
                                                                    values.valservico,
                                                                ))
                                                        }
                                                        placeholder=""
                                                        title="Custo total"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:grid md:grid-cols-3 md:gap-x-6">
                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="tecnico"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Técnico
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        as="select"
                                                        placeholder="Selecione o status"
                                                        className="shadow w-full placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        name="tecnico"
                                                        id="tecnico"
                                                        value={values.tecnico}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        <option value="">
                                                            Selecione o técnico
                                                        </option>
                                                        {tecnicos.map(
                                                            (
                                                                tecn: any,
                                                                idx: number,
                                                            ) => (
                                                                <option
                                                                    key={idx}
                                                                    value={
                                                                        tecn.id
                                                                    }
                                                                >
                                                                    {tecn.name}
                                                                </option>
                                                            ),
                                                        )}
                                                    </Field>
                                                    {errors.tecnico &&
                                                        touched.tecnico && (
                                                            <div className="text-sm text-secundary-red pl-1 pt-1">
                                                                {errors.tecnico}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="status"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Status do serviço
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        as="select"
                                                        placeholder="Selecione o status"
                                                        className="shadow w-full placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        name="status"
                                                        id="status"
                                                        value={values.status}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        <option value="">
                                                            Selecione o status
                                                        </option>
                                                        {statOrdens.map(
                                                            (stat, idx) => (
                                                                <option
                                                                    key={idx}
                                                                    value={
                                                                        stat.value
                                                                    }
                                                                >
                                                                    {stat.label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>

                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="status"
                                                    className="pl-1 text-sm text-transparent font-semibold"
                                                >
                                                    E-mail
                                                </label>
                                                <div className="flex items-center justify-center">
                                                    <div className="">
                                                        <Field
                                                            className="my-2.5 bg-gray-200  shadow-md focus:ring-0 focus:border-blue-200"
                                                            type="checkbox"
                                                            name="envioemail"
                                                            id="envioemail"
                                                            title="Enviar e-mail ao cliente"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            defaultChecked={
                                                                values.envioemail
                                                            }
                                                        />
                                                    </div>
                                                    <label
                                                        htmlFor="envioemail"
                                                        className="pl-2 text-sm text-gray-600 font-semibold drop-shadow text-left"
                                                    >
                                                        Enviar email ao cliente
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:grid md:grid-cols-2 md:gap-x-6">
                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="detalhes"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Detalhes do serviço
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        as="textarea"
                                                        rows={2}
                                                        name="detalhes"
                                                        id="detalhes"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.detalhes}
                                                        title="Digite o detalhe"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4 md:mb-6">
                                                <label
                                                    htmlFor="observacoes"
                                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                                >
                                                    Observações
                                                </label>
                                                <div className="w-full relative">
                                                    <Field
                                                        className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                        as="textarea"
                                                        rows={2}
                                                        name="observacoes"
                                                        id="observacoes"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={
                                                            values.observacoes
                                                        }
                                                        title="Digite as observaçôes"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ABoxContent>
                                <ABoxFooter>
                                    <div className="flex justify-end">
                                        <button
                                            className={`shadow rounded-md px-4 py-2 border-2 border-white flex items-center justify-center transition-all duration-500 ${
                                                !isValid
                                                    ? ''
                                                    : 'bg-primary-blue hover:bg-secundary-blue'
                                            }`}
                                            type="submit"
                                            disabled={!isValid}
                                        >
                                            {loading ? (
                                                <CgSpinnerTwo className="text-white text-lg mr-2 animate-spin" />
                                            ) : (
                                                <IoSave className="text-white text-lg mr-2" />
                                            )}
                                            <span
                                                className={`text-base ${
                                                    !isValid
                                                        ? 'text-gray-300'
                                                        : 'text-white drop-shadow-md'
                                                }`}
                                            >
                                                Salvar
                                            </span>
                                        </button>
                                    </div>
                                </ABoxFooter>
                            </Form>
                        </>
                    )}
                </Formik>
            </ABoxAll>
        </>
    );
};

export default OrdEditar;
