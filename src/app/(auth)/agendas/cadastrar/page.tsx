'use client';
import React, {useState, useCallback, useEffect} from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import {AButtomBack} from '@/components/auth/buttons';
import {Field, Form, Formik} from 'formik';
import {IoSave} from 'react-icons/io5';
import {cadastrar} from '../schema';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import {CgSpinnerTwo} from 'react-icons/cg';
import Select from 'react-select';
import {useAuthContext} from '@/contexts/auth';
interface FormProps {
    cliente: string;
    data: string;
    hora: string;
    servico: string;
    detalhes: string;
    tecnico: string;
    status: string;
    observacoes: string;
}

const AgendaCadastrar = () => {
    const {user, logout} = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [clientesAll, setClientesAll] = useState<any>([]);

    const handleSubmitForm = useCallback(
        async (values: FormProps, {resetForm}: any) => {
            setLoading(true);
            const response = await sosapi.post(
                `agendas`,
                {
                    cliente_id: (values.cliente as any).value,
                    datahora: values.data + ' ' + values.hora,
                    servico: values.servico,
                    detalhes: values.detalhes,
                    tecnico: values.tecnico,
                    status: values.status,
                    observacoes: values.observacoes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            const {message, status} = response.data;

            if (status === 200) {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
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

    const statusVisita = [
        {value: 1, label: 'Aberta'},
        {value: 2, label: 'Em atendimento'},
        {value: 3, label: 'Fechada'},
    ];

    const tecnicos = [
        {
            value: 1,
            label: 'Anderson',
        },
        {
            value: 2,
            label: 'José',
        },
        {
            value: 3,
            label: 'Mario',
        },
    ];

    const options = clientesAll.map((cliente: any) => ({
        value: cliente.id,
        label: cliente.nome,
    }));

    return (
        <ABoxAll>
            <ABoxHeader>
                <div>
                    <AButtomBack url="/agendas" />
                </div>
            </ABoxHeader>
            <Formik
                validationSchema={cadastrar}
                initialValues={{
                    cliente: '',
                    data: '',
                    hora: '',
                    servico: '',
                    detalhes: '',
                    tecnico: '',
                    status: '',
                    observacoes: '',
                }}
                onSubmit={handleSubmitForm}
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    handleChange,
                    handleBlur,
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
                                    <div className="md:grid md:grid-cols-4 md:gap-x-6">
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="cliente"
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

                                        <div className="">
                                            <label
                                                htmlFor="data"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Data do serviço
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="date"
                                                    name="data"
                                                    id="data"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.data}
                                                    title="Digite o data"
                                                />
                                                {errors.data &&
                                                    touched.data && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.data}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="hora"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Hora do serviço
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="time"
                                                    name="hora"
                                                    id="hora"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.hora}
                                                    title="Digite o hora"
                                                />
                                                {errors.hora &&
                                                    touched.hora && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.hora}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-2 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="servico"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Serviço requisitado
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-3 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="servico"
                                                    id="servico"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.servico}
                                                    title="Digite o servico requisitado"
                                                />
                                                {errors.servico &&
                                                    touched.servico && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.servico}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="detalhes"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Detalhes do serviço
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-3 text-base text-gray-500 font-medium"
                                                    as="textarea"
                                                    name="detalhes"
                                                    id="detalhes"
                                                    rows={1}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.detalhes}
                                                    title="Digite os detalhes do serviço"
                                                />
                                                {errors.detalhes &&
                                                    touched.detalhes && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.detalhes}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-3 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="tecnico"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Técnico
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-3 text-base text-gray-500 font-medium"
                                                    as="select"
                                                    name="tecnico"
                                                    id="tecnico"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.tecnico}
                                                    title="Selecione o tecnico"
                                                >
                                                    <option value="">
                                                        Selecione a tecnico
                                                    </option>
                                                    {tecnicos.map(
                                                        (
                                                            tecnico: any,
                                                            uidx: number,
                                                        ) => (
                                                            <option
                                                                key={uidx}
                                                                value={
                                                                    tecnico.label
                                                                }
                                                            >
                                                                {tecnico.label}
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

                                        <div className="">
                                            <label
                                                htmlFor="status"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Status
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-3 text-base text-gray-500 font-medium"
                                                    as="select"
                                                    name="status"
                                                    id="status"
                                                    maxLength={9}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.status}
                                                    title="Digite a status"
                                                >
                                                    <option value="">
                                                        Selecione a tecnico
                                                    </option>
                                                    {statusVisita.map(
                                                        (
                                                            status: any,
                                                            uidx: number,
                                                        ) => (
                                                            <option
                                                                key={uidx}
                                                                value={
                                                                    status.value
                                                                }
                                                            >
                                                                {status.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </Field>
                                                {errors.status &&
                                                    touched.status && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.status}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="observacoes"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Observações
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="textarea"
                                                    rows={1}
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

export default AgendaCadastrar;
