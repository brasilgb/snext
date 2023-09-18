'use client';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import {Field, Form, Formik} from 'formik';
import {IoSave} from 'react-icons/io5';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import {CgSpinnerTwo} from 'react-icons/cg';
import schema from './schema';
import {useAuthContext} from '@/contexts/auth';

interface FormProps {
    id: string;
    servidor: string;
    porta: string;
    seguranca: string;
    usuario: string;
    senha: string;
    assunto: string;
    mensagem: string;
}

const Email = () => {
    const {user, logout} = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [emails, setEmails] = useState<any>([]);

    useEffect(() => {
        const getEmails = async () => {
            await sosapi
                .get(`/email`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const {data, token} = response.data;
                    setEmails(data[0]);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getEmails();
    }, [user, logout]);

    const handleSubmitForm = useCallback(
        async (values: FormProps) => {
            setLoading(true);

            const response = await sosapi.patch(
                `email/${values.id}`,
                {
                    servidor: values.servidor,
                    porta: values.porta,
                    seguranca: values.seguranca,
                    usuario: values.usuario,
                    senha: values.senha,
                    assunto: values.assunto,
                    mensagem: values.mensagem,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            const {message, status, token} = response.data;

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
                    id: emails.id,
                    servidor: emails.servidor,
                    porta: emails.porta,
                    seguranca: emails.seguranca,
                    usuario: emails.usuario,
                    senha: emails.senha,
                    assunto: emails.assunto,
                    mensagem: emails.mensagem,
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
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="servidor"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Servidor de e-mail
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="servidor"
                                                    id="servidor"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.servidor}
                                                    title="Selecione o servidor"
                                                />
                                                {errors.servidor &&
                                                    touched.servidor && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.servidor}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="porta"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Porta
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="porta"
                                                    id="porta"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.porta}
                                                    title="Digite o porta"
                                                    maxLength={16}
                                                />
                                                {errors.porta &&
                                                    touched.porta && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.porta}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="seguranca"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Tipo de segurança
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="seguranca"
                                                    id="seguranca"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.seguranca}
                                                    title="Digite o tipo de seguranca"
                                                />
                                                {errors.seguranca &&
                                                    touched.seguranca && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.seguranca}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-5 md:gap-x-6">
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="usuario"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Usuário
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="usuario"
                                                    id="usuario"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.usuario}
                                                    title="Digite o estado"
                                                />
                                                {errors.usuario &&
                                                    touched.usuario && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.usuario}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="senha"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Senha
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="senha"
                                                    id="senha"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.senha}
                                                    title="Digite a senha"
                                                />
                                                {errors.senha &&
                                                    touched.senha && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.senha}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="assunto"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Assunto
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="assunto"
                                                    id="assunto"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.assunto}
                                                    title="Digite o assunto"
                                                />
                                                {errors.assunto &&
                                                    touched.assunto && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.assunto}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-1 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="mensagem"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Mensagem
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="textarea"
                                                    name="mensagem"
                                                    id="mensagem"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.mensagem}
                                                    title="Digite o endereço"
                                                />
                                                {errors.mensagem &&
                                                    touched.mensagem && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.mensagem}
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

export default Email;
