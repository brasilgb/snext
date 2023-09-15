'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import { AButtomBack } from '@/components/auth/buttons';
import Select from 'react-select';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { IoSave } from 'react-icons/io5';
import { CgSpinnerTwo } from 'react-icons/cg';
import schema from '../schema';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { maskCelular, maskCep, maskDate, maskPhone, unMask } from '@/utils';
import sosapi from '@/services/sosapi';
import moment from 'moment';
import AMessage from '@/components/auth/message';
import axios from 'axios';
import { useAuthContext } from '@/contexts/auth';
import { useSearchParams } from 'next/navigation';

interface FormProps {
    cpf: string;
    nascimento: string;
    nome: string;
    email: string;
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    endereco: string;
    complemento: string;
    telefone: string;
    contato: string;
    telcontato: string;
    obs: string;
}

const CliEditar = () => {
    const { user, logout } = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [clientes, setClientes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const params = searchParams.get('q');

    const onBlurCep = async (e: any, setFieldValue: any) => {
        const { value } = e.target;
        let cep = unMask(value);

        if (cep?.length !== 8) {
            return;
        }

        await axios
            .get(`https://viacep.com.br/ws/${cep}/json/`, {
                headers: {
                    Accept: 'application/json',
                },
            })
            .then(response => {
                setFieldValue('uf', response.data.uf);
                setFieldValue('cidade', response.data.localidade);
                setFieldValue('bairro', response.data.bairro);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                return;
            });
    };

    const formatCpfCnpj = (num: string) => {
        if (num?.length < 12) {
            return cpf.format(num);
        }
        if (num?.length > 11) {
            return cnpj.format(num);
        }
    };

    const maskTelefone = (num: string) => {
        if (num?.length < 14) {
            return maskPhone(num);
        }
        if (num?.length > 13) {
            return maskCelular(num);
        }
    };

    useEffect(() => {
        const getClientes = async () => {
            await sosapi
                .get(`clientes/${params}`, {
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
                    setClientes(data.data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getClientes();
    }, [params, user, logout]);

    const handleSubmitForm = useCallback(
        async (values: FormProps, { resetForm }: any) => {
            setLoading(true);
            let dtformat: any = maskDate(values.nascimento);
            let formatedDate =
                dtformat.split('/')[2] +
                dtformat.split('/')[1] +
                dtformat.split('/')[0];
            const response = await sosapi.patch(
                `clientes/${params}`,
                {
                    cpf: values.cpf,
                    nascimento: moment(formatedDate).format('YYYY-MM-DD'),
                    nome: values.nome,
                    email: values.email,
                    cep: values.cep,
                    uf: values.uf,
                    cidade: values.cidade,
                    bairro: values.bairro,
                    endereco: values.endereco,
                    complemento: values.complemento,
                    telefone: values.telefone,
                    contato: values.contato,
                    telcontato: values.telcontato,
                    obs: values.obs,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            const { message, status, token } = response.data;
            if (!token) {
                logout(user.token);
                return;
            }
            if (status === 200) {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
                setMessage(message);
            } else {
                setMessage(message);
            }
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        },
        [user, params],
    );

    return (
        <ABoxAll>
            <ABoxHeader>
                <div>
                    <AButtomBack url="/clientes" />
                </div>
            </ABoxHeader>
            <Formik
                validationSchema={schema}
                initialValues={{
                    cpf: clientes.cpf ? clientes.cpf : '',
                    nascimento: moment(clientes.nascimento).format('DDMMYYYY'),
                    nome: clientes.nome,
                    email: clientes.email,
                    cep: clientes.cep,
                    uf: clientes.uf,
                    cidade: clientes.cidade,
                    bairro: clientes.bairro,
                    endereco: clientes.endereco,
                    complemento: clientes.complemento,
                    telefone: clientes.telefone,
                    contato: clientes.contato,
                    telcontato: clientes.telcontato,
                    obs: clientes.obs,
                }}
                enableReinitialize
                onSubmit={handleSubmitForm}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
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
                                    <div className="md:grid md:grid-cols-6 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="cpf"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                CPF/CNPJ
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="cpf"
                                                    id="cpf"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={formatCpfCnpj(
                                                        values.cpf,
                                                    )}
                                                    title="Digite o cpf"
                                                />
                                                {errors.cpf && touched.cpf && (
                                                    <div className="text-sm text-secundary-red pl-1 pt-1">
                                                        {errors.cpf}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="nascimento"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Nascimento
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="nascimento"
                                                    id="nascimento"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={maskDate(
                                                        values.nascimento,
                                                    )}
                                                    title="Digite o nascimento"
                                                    maxLength={8}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="nome"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Nome
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="nome"
                                                    id="nome"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.nome}
                                                    title="Digite o nome"
                                                />
                                                {errors.nome &&
                                                    touched.nome && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.nome}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="email"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                E-mail
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.email}
                                                    title="Digite o email"
                                                />
                                                {errors.email &&
                                                    touched.email && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.email}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-6 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="cep"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                CEP
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="cep"
                                                    id="cep"
                                                    maxLength={11}
                                                    onChange={handleChange}
                                                    onBlur={(e: any) =>
                                                        onBlurCep(
                                                            e,
                                                            setFieldValue,
                                                        )
                                                    }
                                                    value={maskCep(values.cep)}
                                                    title="Digite o cep"
                                                />
                                                {errors.cep && touched.cep && (
                                                    <div className="text-sm text-secundary-red pl-1 pt-1">
                                                        {errors.cep}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="uf"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                UF
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="uf"
                                                    id="uf"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.uf}
                                                    title="Digite o estado"
                                                />
                                                {errors.uf && touched.uf && (
                                                    <div className="text-sm text-secundary-red pl-1 pt-1">
                                                        {errors.uf}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="cidade"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Cidade
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="cidade"
                                                    id="cidade"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.cidade}
                                                    title="Digite a cidade"
                                                />
                                                {errors.cidade &&
                                                    touched.cidade && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.cidade}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="bairro"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Bairro
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="bairro"
                                                    id="bairro"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.bairro}
                                                    title="Digite o bairro"
                                                />
                                                {errors.bairro &&
                                                    touched.bairro && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.bairro}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-5 md:gap-x-6">
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="endereco"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Endereço
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="endereco"
                                                    id="endereco"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.endereco}
                                                    title="Digite o endereço"
                                                />
                                                {errors.endereco &&
                                                    touched.endereco && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.endereco}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="complemento"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Complemento
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="complemento"
                                                    id="complemento"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.complemento}
                                                    title="Digite o complemento"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-5 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="telefone"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Telefone
                                            </label>
                                            <div className="w-full relative mb-4">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="telefone"
                                                    id="telefone"
                                                    maxlength="15"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={maskTelefone(
                                                        values.telefone,
                                                    )}
                                                    title="Digite o telefone"
                                                />
                                                {errors.telefone &&
                                                    touched.telefone && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.telefone}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <label
                                                htmlFor="contato"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Nome do contato
                                            </label>
                                            <div className="w-full relative mb-4">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="contato"
                                                    id="contato"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.contato}
                                                    title="Digite o nome contato"
                                                />
                                                {/* <ErrorMessage nome="name">{(msg: any) => <div className="text-sm pl-2 pt-0.5 text-red-500 drop-shadow">{msg}</div>}</ErrorMessage> */}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="telcontato"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Telefone do contato
                                            </label>
                                            <div className="w-full relative mb-4">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="telcontato"
                                                    id="telcontato"
                                                    maxLength="15"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={maskTelefone(
                                                        values.telcontato,
                                                    )}
                                                    title="Digite o telefone do contato"
                                                />
                                                {/* <ErrorMessage nome="name">{(msg: any) => <div className="text-sm pl-2 pt-0.5 text-red-500 drop-shadow">{msg}</div>}</ErrorMessage> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <label
                                            htmlFor="obs"
                                            className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                        >
                                            Observações
                                        </label>
                                        <div className="w-full relative mb-4">
                                            <Field
                                                className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                as="textarea"
                                                rows={3}
                                                name="obs"
                                                id="obs"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.obs}
                                                title="Observações sobre o cliente"
                                            />
                                            {/* <ErrorMessage nome="name">{(msg: any) => <div className="text-sm pl-2 pt-0.5 text-red-500 drop-shadow">{msg}</div>}</ErrorMessage> */}
                                        </div>
                                    </div>
                                </div>
                            </ABoxContent>
                            <ABoxFooter>
                                <div className="flex justify-end">
                                    <button
                                        className={`shadow rounded-md px-4 py-2 border-2 border-white flex items-center justify-center transition-all duration-500 ${!isValid
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
                                            className={`text-base ${!isValid
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

export default CliEditar;
