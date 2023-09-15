'use client';
import {useAuthContext} from '@/contexts/auth';
import {Field, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import schema from './schema';
import {CgSpinnerTwo} from 'react-icons/cg';
import {MdLockPerson} from 'react-icons/md';
import moment from 'moment';
import sosapi from '@/services/sosapi';
import Image from 'next/image';

interface LoginProps {
    email: string;
    password: string;
}

const Login = () => {
    const {user, logout, loginMessage, login, loading} = useAuthContext();
    const [timeNow, setTimeNow] = useState<any>('');
    const [empresas, setEmpresas] = useState<any>([]);

    useEffect(() => {
        setInterval(() => {
            setTimeNow(moment().format('H:mm:ss'));
        }, 1000);
    }, []);

    const handleLogin = (values: LoginProps, {resetForm}: any) => {
        login({email: values.email, password: values.password});
        resetForm({});
    };

    return (
        <div className="px-4">
            <div className="flex items-center justify-between pb-2">
                <h1 className="text-sm font-semibold text-gray-500">
                    Bem vindo
                </h1>
                <h1 className="text-sm font-semibold text-gray-500">
                    {timeNow}
                </h1>
            </div>
            <div className="w-full flex items-center justify-center py-6">
                <Image
                    src={empresas.logo
                        ?`${process.env.NEXT_PUBLIC_SITE_URL}/storage/uploads/${empresas.logo}`
                        :`${process.env.NEXT_PUBLIC_SITE_URL}/storage/image/notimage.jpg`}
                    alt={empresas.razao}
                    className="w-16 h-16"
                    width={64}
                    height={64}
                />
            </div>
            <div className="flex items-center justify-start pt-6">
                <MdLockPerson size={26} className="mr-2 text-primary-red" />
                <h1 className="text-base w-full text-primary-blue font-semibold border-b border-b-gray-100">
                    Acessar o Sistema
                </h1>
            </div>

            <div className="">
                <div className="flex items-center min-h-[20px] m-2">
                    {loginMessage && (
                        <h1 className="text-sm text-primary-red font-medium">
                            {loginMessage}
                        </h1>
                    )}
                </div>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    onSubmit={handleLogin}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        isValid,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="col-span-2">
                                <label
                                    htmlFor="email"
                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                >
                                    Email
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
                                        title="Digite o email"
                                    />
                                    {errors.email && touched.email && (
                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="password"
                                    className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                >
                                    Senha
                                </label>
                                <div className="w-full relative mb-4 md:mb-6">
                                    <Field
                                        className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                        type="password"
                                        name="password"
                                        id="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        title="Digite o password"
                                    />
                                    {errors.password && touched.password && (
                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className={`w-full shadow rounded-full px-4 h-12 border-2 border-white flex items-center justify-center transition-all duration-500 ${
                                        !isValid
                                            ? ''
                                            : 'bg-primary-blue hover:bg-secundary-blue'
                                    }`}
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    {loading ? (
                                        <CgSpinnerTwo className="text-white text-xl mr-2 animate-spin" />
                                    ) : (
                                        <span className="text-white text-base mr-2">
                                            Entrar
                                        </span>
                                    )}
                                    <span
                                        className={`text-base ${
                                            !isValid
                                                ? 'text-gray-300'
                                                : 'text-white drop-shadow-md'
                                        }`}
                                    ></span>
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
