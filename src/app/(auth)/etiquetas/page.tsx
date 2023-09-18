'use client';
import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import {Field, Form, Formik} from 'formik';
import AMessage from '@/components/auth/message';
import {useAuthContext} from '@/contexts/auth';
import schema from './schema';
import sosapi from '@/services/sosapi';
import ReactToPrint from 'react-to-print';
import {IoPrintSharp} from 'react-icons/io5';
import {maskCelular, maskPhone} from '@/utils';

const ComponentToPrint = forwardRef((props: any, ref: any) => {
    const {value} = props;

    const maskTelefone = (num: string) => {
        if (num?.length < 14) {
            return maskPhone(num);
        }
        if (num?.length > 13) {
            return maskCelular(num);
        }
    };
    ComponentToPrint.displayName = 'ComponentToPrint';

    return (
        <div ref={ref}>
            <div className="h-screen p-8">
                <div className="grid grid-cols-6 gap-0">
                    {value.map((val: any, i: number) => (
                        <div
                            key={i}
                            className="flex-col items-center pt-1 px-1 mb-[2.5px] justify-center bg-white w-[117px] h-[64px] border border-gray-50"
                        >
                            <h1 className="text-xs text-center truncate">
                                {val.empresa}
                            </h1>
                            <h1 className="my-0 text-sm font-semibold text-center">
                                {('000000' + val.ordem).slice(-6)}
                            </h1>
                            <h1 className="text-xs text-center">
                                {maskTelefone(val.telefone)}
                            </h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

const ComponentToPrintWrapper = ({item}: any) => {
    const componentRef = useRef(null);

    return (
        <div style={{display: 'flex'}}>
            <ReactToPrint
                trigger={() => (
                    <button className="flex items-center justify-center transition-all duration-300 bg-secundary-blue hover:bg-terciary-blue px-4 py-2 drop-shadow-md rounded-lg border-2 border-white">
                        <IoPrintSharp className="text-lg text-gray-50" />{' '}
                        <span className="text-white drop-shadow-md ml-2">
                            Imprimir etiqueta
                        </span>
                    </button>
                )}
                content={() => componentRef.current}
            />
            <div className="hidden">
                <ComponentToPrint ref={componentRef} value={item} />
            </div>
        </div>
    );
};

interface FormProps {
    paginas: string;
    inicio: string;
    fim: string;
}
const Recibo = () => {
    const {user, logout} = useAuthContext();
    const printRef = useRef<any>();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [ordens, setOrdens] = useState<any>([]);
    const [empresas, setEmpresas] = useState<any>([]);
    const [itemsTags, setItemsTags] = useState<any>([]);

    useEffect(() => {
        const getEmpresas = async () => {
            await sosapi
                .get(`empresa`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setEmpresas(data[0]);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getEmpresas();
    }, [user]);

    useEffect(() => {
        const getOrdens = async () => {
            await sosapi
                .get(`allordens`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setOrdens(data.pop());
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getOrdens();
    }, [user]);

    // onsubmit
    const onsubmit = (values: any) => {
        // console.log(values);
    };

    const onBlurPages = (e: any, setFieldValue: any) => {
        itemsTags.splice(0, itemsTags.length);
        const {value} = e.target;
        const fromOrder = ordens?.id + value * 96;
        setFieldValue('fim', fromOrder);
        let x = 0;
        for (let i = ordens?.id + 1; i < fromOrder + 1; i++) {
            let tags = {
                empresa: empresas.razao,
                razao: empresas.razao,
                telefone: empresas.telefone,
                paginas: value,
                inicio: ordens?.id + 1,
                fim: fromOrder,
                ordem: ordens?.id + 1 + x++,
            };

            itemsTags.push(tags);
        }
        setItemsTags(itemsTags);
    };

    return (
        <ABoxAll>
            <ABoxHeader>
                <div></div>
            </ABoxHeader>
            <Formik
                validationSchema={schema}
                enableReinitialize
                initialValues={{
                    paginas: '0',
                    inicio: ordens.id + 1,
                    fim: ordens.id + 1,
                }}
                onSubmit={onsubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    handleChange,
                    handleBlur,
                    handleSubmit,
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
                                {/* <div className="h-screen p-8">
                                    <div className="grid grid-cols-6 gap-0">
                                        {itemsTags.map((val: any, i: number) => (
                                            <div key={i} className="flex-col items-center pt-1 px-1 mb-1 justify-center bg-white w-[117px] h-[64px] border border-gray-50">
                                                <h1 className="text-xs text-center truncate">{val.razao}</h1>
                                                <h1 className="my-0 text-sm font-medium text-center">{('000000' + val.ordem).slice(-6)}</h1>
                                                <h1 className="text-xs text-center">{maskTelefone(val.telefone)}</h1>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}

                                <div className="mt-4 px-2">
                                    <div className="md:grid md:grid-cols-3 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="paginas"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Número de páginas
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="paginas"
                                                    id="paginas"
                                                    autoFocus={true}
                                                    onChange={handleChange}
                                                    value={values.paginas}
                                                    onBlur={(e: any) =>
                                                        onBlurPages(
                                                            e,
                                                            setFieldValue,
                                                        )
                                                    }
                                                    title="Selecione o número de páginas"
                                                />
                                                {errors.paginas &&
                                                    touched.paginas && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.paginas}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="inicio"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Número da ordem inicial
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="inicio"
                                                    id="inicio"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.inicio}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="">
                                            <label
                                                htmlFor="fim"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Até a ordem
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="fim"
                                                    id="fim"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.fim}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ABoxContent>
                            <ABoxFooter>
                                <div className="flex justify-end">
                                    <div ref={printRef}>
                                        <ComponentToPrintWrapper
                                            key={159}
                                            item={itemsTags}
                                        />
                                    </div>
                                </div>
                            </ABoxFooter>
                        </Form>
                    </>
                )}
            </Formik>
        </ABoxAll>
    );
};

export default Recibo;
