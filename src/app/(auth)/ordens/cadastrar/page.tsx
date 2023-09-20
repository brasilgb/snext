'use client';
import React, {useEffect, useState, useCallback} from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import {AButtomBack} from '@/components/auth/buttons';
import Select from 'react-select';
import {Field, Form, Formik, useFormikContext} from 'formik';
import {IoSave} from 'react-icons/io5';
import {addOrdem} from '../schema';
import {maskDate, unMask} from '@/utils';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import {CgSpinnerTwo} from 'react-icons/cg';
import moment from 'moment';
import {useAuthContext} from '@/contexts/auth';

interface FormProps {
    numordem: string;
    cliente: string;
    equipamento: string;
    modelo: string;
    senha: string;
    defeito: string;
    estado: string;
    acessorios: string;
    observacoes: string;
    previsao: string;
}
export interface CategoryOptions {
    value: string;
    label: string;
}

const OrdCadastrar = () => {
    const {user, logout} = useAuthContext();
    const [ordensAll, setOrdensAll] = useState<any>([]);
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [clientesAll, setClientesAll] = useState<any>([]);

    const handleSubmitForm = useCallback(
        async (values: FormProps, {resetForm}: any) => {
            setLoading(true);
            let dtformat: any = maskDate(values.previsao);
            let formatedDate =
                dtformat.split('/')[2] +
                dtformat.split('/')[1] +
                dtformat.split('/')[0];

            const response = await sosapi.post(
                `ordens`,
                {
                    cliente_id: (values.cliente as any)?.value,
                    numordem: values.numordem,
                    equipamento: values.equipamento,
                    modelo: values.modelo,
                    senha: values.senha,
                    defeito: values.defeito,
                    estado: values.estado,
                    acessorios: values.acessorios,
                    observacoes: values.observacoes,
                    previsao: moment(formatedDate).format('YYYY-MM-DD'),
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            const {message, status, data, token} = response.data;

            if (status === 200) {
                setLoading(false);
                setOrdensAll(data);
                setMessage(message);
            } else {
                setMessage(message);
            }
            setShowMessage(true);
            resetForm();
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        },
        [user],
    );

    useEffect(() => {
        const getOrdensAll = async () => {
            await sosapi
                .get(`allordens`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setOrdensAll(data.pop());
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getOrdensAll();
    }, [user,logout]);

    useEffect(() => {
        const getClientesAll = async () => {
            await sosapi
                .get(`allclientes`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setClientesAll(data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getClientesAll();
    }, [user,logout]);

    const options = clientesAll.map((cliente: any) => ({
        value: cliente.id,
        label: cliente.nome,
    }));

    return (
        <ABoxAll>
            <ABoxHeader>
                <div>
                    <AButtomBack url="/ordens" />
                </div>
            </ABoxHeader>

            <Formik
                validationSchema={addOrdem}
                enableReinitialize
                initialValues={{
                    numordem: ordensAll ? ordensAll.id + 1 : 1,
                    cliente: '',
                    equipamento: '',
                    modelo: '',
                    senha: '',
                    defeito: '',
                    estado: '',
                    acessorios: '',
                    observacoes: '',
                    previsao: '',
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
                    handleSubmit,
                    isValid,
                }) => (
                    <>
                        {showMessage && (
                            <AMessage
                                showmessage={() => setShowMessage(false)}
                                message={message}
                            />
                        )}

                        <Form onSubmit={handleSubmit} autoComplete="off">
                            <ABoxContent>
                                <div className="mt-4 px-2">
                                    <div className="md:grid md:grid-cols-5 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="numordem"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Nº. Ordem
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-100 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="numordem"
                                                    id="numordem"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.numordem}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="client_id"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Nome do cliente
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Select
                                                    options={options}
                                                    placeholder="Selecione o cliente"
                                                    className="shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-1 py-[2.8px] text-base text-gray-500 font-medium"
                                                    styles={{
                                                        control: (
                                                            baseStyles,
                                                            state,
                                                        ) => ({
                                                            ...baseStyles,
                                                            border: '0 !important',
                                                            borderColor:
                                                                state.isFocused
                                                                    ? 'transparent'
                                                                    : 'transparent',
                                                            backgroundColor:
                                                                'transparent',
                                                            '&:hover': {
                                                                border: state.isFocused
                                                                    ? 0
                                                                    : 0,
                                                            },
                                                            outline:
                                                                '1px solid #F9FAFB',
                                                            boxShadow: 'none',
                                                        }),
                                                    }}
                                                    name="cliente"
                                                    id="cliente"
                                                    value={values.cliente}
                                                    onBlur={() => {
                                                        handleBlur({
                                                            target: {
                                                                name: 'cliente',
                                                            },
                                                        });
                                                    }}
                                                    onChange={(e: any) => {
                                                        setFieldValue(
                                                            'cliente',
                                                            e,
                                                        );
                                                    }}
                                                />
                                                {errors.cliente &&
                                                    touched.cliente && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {
                                                                (
                                                                    errors.cliente as any
                                                                ).value
                                                            }
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="equipamento"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Tipo de equipamento
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="equipamento"
                                                    id="equipamento"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.equipamento}
                                                    placeholder="PC, Tablet, Smartphone, Impressora, etc..."
                                                    title="Digite o equipamento"
                                                />
                                                {errors.equipamento &&
                                                    touched.equipamento && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.equipamento}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-7 md:gap-x-6">
                                        <div className="md:col-span-3">
                                            <label
                                                htmlFor="modelo"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Modelo do equipamento
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
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
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="senha"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Senha caso haja
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="senha"
                                                    id="senha"
                                                    maxLength={9}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.senha}
                                                    placeholder="0"
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
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="previsao"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Previsão de entrega
                                            </label>
                                            <div className="w-full relative mb-4">
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
                                                {/* <ErrorMessage nome="name">{(msg: any) => <div className="text-sm pl-2 pt-0.5 text-red-500 drop-shadow">{msg}</div>}</ErrorMessage> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-2 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="defeito"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Defeito relatado
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="textarea"
                                                    rows={3}
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
                                        <div className="">
                                            <label
                                                htmlFor="estado"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Estado do equipamento
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="textarea"
                                                    rows={3}
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
                                    </div>
                                    <div className="md:grid md:grid-cols-2 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="acessorios"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Acessórios do equipamento
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow placeholder-gray-400 bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="textarea"
                                                    rows={3}
                                                    name="acessorios"
                                                    id="acessorios"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.acessorios}
                                                    placeholder="Case, Carregador, Pendrivers, Cabos, etc..."
                                                    title="Digite o acessorios"
                                                />
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="observacoes"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Observações
                                            </label>
                                            <div className="w-full relative mb-4">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="textarea"
                                                    rows={3}
                                                    name="observacoes"
                                                    id="observacoes"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.observacoes}
                                                    title="Digite o observacoes"
                                                />
                                                {errors.observacoes &&
                                                    touched.observacoes && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.observacoes}
                                                        </div>
                                                    )}
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
    );
};

export default OrdCadastrar;
