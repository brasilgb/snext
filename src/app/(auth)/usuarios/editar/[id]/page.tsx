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
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import {CgSpinnerTwo} from 'react-icons/cg';
import {editar} from '../../schema';
import {useAuthContext} from '@/contexts/auth';

interface FormProps {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    function: string;
    status: string;
}

const UsuarioEditar = ({params}: {params: {id: number}}) => {
    const {user, logout} = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [usuarios, setUsuarios] = useState<any>([]);

    useEffect(() => {
        const getUsuarios = async () => {
            await sosapi
                .get(`users/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    setUsuarios(response.data.data);
                })
                .catch(err => {
                    logout(user.token);
                });
        };
        getUsuarios();
    }, [params]);

    const handleSubmitForm = useCallback(
        async (values: FormProps, {resetForm}: any) => {
            setLoading(true);
            const response = await sosapi.patch(
                `users/${params.id}`,
                {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    function: values.function,
                    status: values.status,
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
        [params],
    );

    const userStatus = [
        {value: 1, label: 'Ativo'},
        {value: 2, label: 'Inativo'},
    ];

    const userFunction = [
        {value: 1, label: 'Supervisor'},
        {value: 2, label: 'Usuário'},
        {value: 2, label: 'Técnico'},
    ];

    return (
        <ABoxAll>
            <ABoxHeader>
                <div>
                    <AButtomBack url="/usuarios" />
                </div>
            </ABoxHeader>
            <Formik
                validationSchema={editar}
                initialValues={{
                    name: usuarios.name,
                    email: usuarios.email,
                    password: usuarios.password,
                    passwordConfirmation: '',
                    function: usuarios.function,
                    status: usuarios.status,
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
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="name"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Nome
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.name}
                                                    title="Digite o name"
                                                />
                                                {errors.name &&
                                                    touched.name && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.name}
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
                                        <div className="">
                                            <label
                                                htmlFor="password"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Senha
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="password"
                                                    id="password"
                                                    maxLength={9}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    title="Digite o password"
                                                />
                                                {errors.password &&
                                                    touched.password && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.password}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="passwordConfirmation"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Repita a senha
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="passwordConfirmation"
                                                    id="passwordConfirmation"
                                                    maxLength={9}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={
                                                        values.passwordConfirmation
                                                    }
                                                    title="repita a senha"
                                                />
                                                {errors.passwordConfirmation &&
                                                    touched.passwordConfirmation && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {
                                                                errors.passwordConfirmation
                                                            }
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-4 md:gap-x-6">
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="function"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Função
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="select"
                                                    name="function"
                                                    id="function"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.function}
                                                    title="Digite o estado"
                                                >
                                                    <option value="">
                                                        Selecione a função
                                                    </option>
                                                    {userFunction.map(
                                                        (
                                                            user: any,
                                                            uidx: number,
                                                        ) => (
                                                            <option
                                                                key={uidx}
                                                                value={
                                                                    user.value
                                                                }
                                                            >
                                                                {user.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </Field>
                                                {errors.function &&
                                                    touched.function && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.function}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <label
                                                htmlFor="status"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Status
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="select"
                                                    name="status"
                                                    id="status"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.status}
                                                    title="Digite a status"
                                                >
                                                    <option value="">
                                                        Selecione o status
                                                    </option>
                                                    {userStatus.map(
                                                        (
                                                            status: any,
                                                            sidx: number,
                                                        ) => (
                                                            <option
                                                                key={sidx}
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

export default UsuarioEditar;
