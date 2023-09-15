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
import schema from '../schema';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import {CgSpinnerTwo} from 'react-icons/cg';
import {useAuthContext} from '@/contexts/auth';
import { useSearchParams } from 'next/navigation';
interface FormProps {
    remetente: string;
    destinatario: string;
    mensagem: string;
}

const MensagemEditar = () => {
    const {user, logout} = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [mensagens, setMensagens] = useState<any>([]);
    const searchParams = useSearchParams();
    const params = searchParams.get('q');
    useEffect(() => {
        const getMensagens = async () => {
            await sosapi
                .get(`mensagens/${params}`, {
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
                    setMensagens(data);
                })
                .catch(err => {
                    // logout(user.token);
                });
        };
        getMensagens();
    }, [params, user, logout]);

    const handleSubmitForm = useCallback(
        async (values: FormProps) => {
            setLoading(true);
            const response = await sosapi.patch(
                `mensagens/${params}`,
                {
                    remetente: values.remetente,
                    destinatario: values.destinatario,
                    mensagem: values.mensagem,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            const {message, status, token} = response.data;
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
        [params, user],
    );

    return (
        <ABoxAll>
            <ABoxHeader>
                <div>
                    <AButtomBack url="/mensagens" />
                </div>
            </ABoxHeader>
            <Formik
                validationSchema={schema}
                enableReinitialize
                initialValues={{
                    remetente: mensagens.remetente,
                    destinatario: mensagens.destinatario,
                    mensagem: mensagens.mensagem,
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
                            <ABoxContent>
                                <div className="mt-4 px-2">
                                    <div className="md:grid md:grid-cols-2 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="remetente"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                De
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="remetente"
                                                    id="remetente"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.remetente}
                                                    title="Selecione o remetente"
                                                />
                                                {errors.remetente &&
                                                    touched.remetente && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.remetente}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="destinatario"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Para
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="destinatario"
                                                    id="destinatario"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.destinatario}
                                                    title="Digite o destinatario"
                                                />
                                                {errors.destinatario &&
                                                    touched.destinatario && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {
                                                                errors.destinatario
                                                            }
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
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
                                                    rows={2}
                                                    name="mensagem"
                                                    id="mensagem"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.mensagem}
                                                    title="Digite o mensagem"
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

export default MensagemEditar;
