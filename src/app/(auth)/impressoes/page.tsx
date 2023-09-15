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
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import { CgSpinnerTwo } from 'react-icons/cg';
import schema from './schema';
import { useAuthContext } from '@/contexts/auth';

interface FormProps {
    id: string;
    entrada: string;
    saida: string;
}

const Impressoes = () => {
    const { user, logout } = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [impressoes, setImpressoes] = useState<any>([]);

    useEffect(() => {
        const getImpressoes = async () => {
            await sosapi
                .get(`/impressoes`, {
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
                    setImpressoes(data[0]);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getImpressoes();
    }, [user]);

    const handleSubmitForm = useCallback(
        async (values: FormProps) => {
            setLoading(true);
            const response = await sosapi.patch(
                `impressoes/${values.id}`,
                {
                    entrada: values.entrada,
                    saida: values.saida,
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
                    id: impressoes.id,
                    entrada: impressoes.entrada,
                    saida: impressoes.saida,
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
                                    <div className="">
                                        <label
                                            htmlFor="entrada"
                                            className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                        >
                                            Recibo de entrada
                                        </label>
                                        <div className="w-full relative mb-4 md:mb-6">
                                            <Field
                                                className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                as="textarea"
                                                name="entrada"
                                                id="entrada"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.entrada}
                                                title="Digite o recibo de entrada"
                                            />
                                            {errors.entrada &&
                                                touched.entrada && (
                                                    <div className="text-sm text-secundary-red pl-1 pt-1">
                                                        {errors.entrada}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    <div className="">
                                        <label
                                            htmlFor="saida"
                                            className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                        >
                                            Termo de garantia
                                        </label>
                                        <div className="w-full relative mb-4 md:mb-6">
                                            <Field
                                                className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                as="textarea"
                                                name="saida"
                                                id="saida"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.saida}
                                                title="Digite o termo de garantia"
                                            />
                                            {errors.saida && touched.saida && (
                                                <div className="text-sm text-secundary-red pl-1 pt-1">
                                                    {errors.saida}
                                                </div>
                                            )}
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

export default Impressoes;
