'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import { Field, Form, Formik } from 'formik';
import { IoSave } from 'react-icons/io5';
import { cnpj } from 'cpf-cnpj-validator';
import schema from './schema';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import { CgSpinnerTwo } from 'react-icons/cg';
import { maskCep, maskPhone, unMask } from '@/utils';
import axios from 'axios';
import { useAuthContext } from '@/contexts/auth';
import Image from 'next/image';

interface FormProps {
    id: string;
    razao: string;
    cnpj: string;
    logo: any;
    endereco: string;
    bairro: string;
    uf: string;
    cidade: string;
    cep: string;
    telefone: string;
    site: string;
    email: string;
}

const Empresa = () => {
    const { user, logout } = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [empresas, setEmpresas] = useState<any>([]);
    const [previewImage, setPreviewImage] = useState<any>(null);
    const fileRef = useRef<any>(null);

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

    useEffect(() => {
        const getEmpresas = async () => {
            await sosapi
                .get('/empresa')
                .then(response => {
                    const { data, token } = response.data;
                    if (!token) {
                        logout(user.token);
                        return;
                    }
                    setEmpresas(data[0]);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getEmpresas();
    }, [user, logout]);

    const onChange = (e: any, setFieldValue: any) => {

        setFieldValue('logo', e.target.files[0]);

        for (const file of e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
        }
    };

    const PreviewImage = () => {
        return (
            <div>
                {previewImage && (
                    <Image
                        src={previewImage}
                        alt="previewImage"
                        className="h-11"
                        width={44}
                        height={10}
                    />
                )}
            </div>
        );
    };

    const handleSubmitForm = useCallback(
        async (values: FormProps) => {
            setLoading(true);
            const FilesData = new FormData();
            FilesData.append('razao', values.razao);
            FilesData.append('cnpj', values.cnpj);
            FilesData.append('logo', values.logo);
            FilesData.append('endereco', values.endereco);
            FilesData.append('bairro', values.bairro);
            FilesData.append('uf', values.uf);
            FilesData.append('cidade', values.cidade);
            FilesData.append('cep', values.cep);
            FilesData.append('telefone', values.telefone);
            FilesData.append('site', values.site);
            FilesData.append('email', values.email);
            const response = await sosapi.post(
                `empresa/upload/${values.id}`,
                FilesData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "multipart/form-data",
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
        [user],
    );

    return (
        <ABoxAll>
            <ABoxHeader>
                <div></div>
            </ABoxHeader>
            <Formik
                validationSchema={schema}
                enableReinitialize
                initialValues={{
                    id: empresas.id,
                    razao: empresas.razao,
                    cnpj: empresas.cnpj,
                    logo: null,
                    endereco: empresas.endereco,
                    bairro: empresas.bairro,
                    uf: empresas.uf,
                    cidade: empresas.cidade,
                    cep: empresas.cep,
                    telefone: empresas.telefone,
                    site: empresas.site,
                    email: empresas.email,
                }}
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

                        <Form
                            onSubmit={handleSubmit}
                            autoComplete="off"
                            encType="multipart/form-data"
                        >
                            <Field
                                id="id"
                                name="id"
                                value={values.id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="hidden"
                            />

                            <ABoxContent>
                                <div className="mt-4 px-2">
                                    <div className="md:grid md:grid-cols-4 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="logo"
                                                className="flex items-center justify-between h-20 mt-1 px-2 w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            >
                                                <div className="flex items-center justify-center">
                                                    <h1 className="text-sm text-gray-600 font-semibold">
                                                        {previewImage
                                                            ? 'Logo selecionado'
                                                            : 'Selecione o logo'}
                                                    </h1>
                                                </div>
                                                <input
                                                    id="logo"
                                                    name="logo"
                                                    hidden
                                                    type="file"
                                                    onChange={(e: any) =>
                                                        onChange(
                                                            e,
                                                            setFieldValue,
                                                        )
                                                    }
                                                    title="Selecione a logo"
                                                />
                                                <div className="">
                                                    {previewImage ? (
                                                        <PreviewImage />
                                                    ) : (
                                                        <Image
                                                            src={empresas.logo ? `${process.env.NEXT_PUBLIC_SITE_URL}/storage/uploads/${empresas.logo}` : `${process.env.NEXT_PUBLIC_SITE_URL}/storage/image/notimage.jpg`}
                                                            alt="logo"
                                                            className="h-11"
                                                            width={44}
                                                            height={10}
                                                        />
                                                    )}
                                                </div>
                                            </label>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="razao"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Razão social
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="razao"
                                                    id="razao"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.razao}
                                                    title="Selecione o razao"
                                                />
                                                {errors.razao &&
                                                    touched.razao && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.razao}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="cnpj"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                CNPJ
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="cnpj"
                                                    id="cnpj"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={cnpj.format(
                                                        values.cnpj,
                                                    )}
                                                    title="Digite o cnpj"
                                                    maxLength={16}
                                                />
                                                {errors.cnpj &&
                                                    touched.cnpj && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.cnpj}
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

                                    <div className="md:grid md:grid-cols-8 md:gap-x-6">
                                        <div className="md:col-span-3">
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
                                        <div className="">
                                            <label
                                                htmlFor="telefone"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Telefone
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="telefone"
                                                    id="telefone"
                                                    maxLength={14}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={maskPhone(
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
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="site"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Site
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="url"
                                                    name="site"
                                                    id="site"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.site}
                                                    title="Digite o site"
                                                />
                                                {errors.site &&
                                                    touched.site && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.site}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="email"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                E-mail
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.email}
                                                    title="Digite o e-mail"
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

export default Empresa;
