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
import schema from '../../schema';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import {CgSpinnerTwo} from 'react-icons/cg';
import {useAuthContext} from '@/contexts/auth';

interface FormProps {
    descricao: string;
    movimento: string;
    valcompra: string;
    valvenda: string;
    unidade: string;
    estmaximo: string;
    estminimo: string;
    tipo: string;
}

const ProdEditar = ({params}: {params: {id: number}}) => {
    const {user, logout} = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [produtos, setProdutos] = useState<any>([]);

    useEffect(() => {
        const getOrdens = async () => {
            await sosapi
                .get(`produtos/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setProdutos(data);
                })
                .catch(err => {
                    logout(user.token);
                });
        };
        getOrdens();
    }, [params]);

    const handleSubmitForm = useCallback(async (values: FormProps) => {
        setLoading(true);

        const response = await sosapi.patch(
            `produtos/${params.id}`,
            {
                descricao: values.descricao,
                movimento: values.movimento,
                valcompra: values.valcompra,
                valvenda: values.valvenda,
                unidade: values.unidade,
                estmaximo: values.estmaximo,
                estminimo: values.estminimo,
                tipo: values.tipo,
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
        setTimeout(() => {
            setShowMessage(false);
        }, 5000);
    }, []);

    const movimentos = [
        {value: 1, label: 'Entrada'},
        {value: 2, label: 'Saída'},
    ];

    const unidades = [
        {value: 1, label: 'Unidade'},
        {value: 2, label: 'Caixa'},
        {value: 3, label: 'Metros'},
        {value: 4, label: 'Kg'},
        {value: 5, label: 'Litros'},
    ];

    const tipos = [
        {value: 1, label: 'Nova'},
        {value: 2, label: 'Usada'},
        {value: 3, label: 'Seminova'},
        {value: 4, label: 'Remanufaturada'},
    ];

    return (
        <ABoxAll>
            <ABoxHeader>
                <div>
                    <AButtomBack url="/produtos" />
                </div>
            </ABoxHeader>
            <Formik
                validationSchema={schema}
                initialValues={{
                    descricao: produtos.descricao,
                    movimento: produtos.movimento,
                    valcompra: produtos.valcompra,
                    valvenda: produtos.valvenda,
                    unidade: produtos.unidade,
                    estmaximo: produtos.estmaximo,
                    estminimo: produtos.estminimo,
                    tipo: produtos.tipo,
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
                                    <div className="md:grid md:grid-cols-3 md:gap-x-6">
                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="descricao"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Descricao
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="descricao"
                                                    id="descricao"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.descricao}
                                                    title="Digite o descrição"
                                                />
                                                {errors.descricao &&
                                                    touched.descricao && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.descricao}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="movimento"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Movimento
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="select"
                                                    name="movimento"
                                                    id="movimento"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.movimento}
                                                    title="selecione o movimento"
                                                >
                                                    <option value="">
                                                        Selecione o movimento
                                                    </option>
                                                    {movimentos.map(
                                                        (
                                                            movimento: any,
                                                            midx: number,
                                                        ) => (
                                                            <option
                                                                key={midx}
                                                                value={
                                                                    movimento.value
                                                                }
                                                            >
                                                                {
                                                                    movimento.label
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </Field>
                                                {errors.movimento &&
                                                    touched.movimento && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.movimento}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:grid md:grid-cols-2 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="valcompra"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Valor de compra
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="valcompra"
                                                    id="valcompra"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.valcompra}
                                                    title="Digite o valcompra"
                                                />
                                                {errors.valcompra &&
                                                    touched.valcompra && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.valcompra}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="valvenda"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Valor de venda
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="valvenda"
                                                    id="valvenda"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.valvenda}
                                                    title="Digite o valvenda"
                                                />
                                                {errors.valvenda &&
                                                    touched.valvenda && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.valvenda}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:grid md:grid-cols-4 md:gap-x-6">
                                        <div className="">
                                            <label
                                                htmlFor="uunidadef"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Unidade de medida
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="select"
                                                    name="unidade"
                                                    id="unidade"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.unidade}
                                                    title="Selecione a unidade"
                                                >
                                                    <option value="">
                                                        Selecione a unidade
                                                    </option>
                                                    {unidades.map(
                                                        (
                                                            unidade: any,
                                                            uidx: number,
                                                        ) => (
                                                            <option
                                                                key={uidx}
                                                                value={
                                                                    unidade.value
                                                                }
                                                            >
                                                                {unidade.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </Field>
                                                {errors.unidade &&
                                                    touched.unidade && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.unidade}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="estmaximo"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Estoque
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="estmaximo"
                                                    id="estmaximo"
                                                    maxLength={9}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.estmaximo}
                                                    title="Digite a estmaximo"
                                                />
                                                {errors.estmaximo &&
                                                    touched.estmaximo && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.estmaximo}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="estminimo"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Estoque mínimo
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    type="text"
                                                    name="estminimo"
                                                    id="estminimo"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.estminimo}
                                                    title="Digite o estminimo"
                                                />
                                                {errors.estminimo &&
                                                    touched.estminimo && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.estminimo}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="">
                                            <label
                                                htmlFor="tipo"
                                                className="pl-1 text-sm text-gray-600 font-semibold drop-shadow"
                                            >
                                                Tipo do produto
                                            </label>
                                            <div className="w-full relative mb-4 md:mb-6">
                                                <Field
                                                    className="w-full shadow bg-gray-50 border-2 border-white rounded-md focus:ring-0 focus:border-blue-200 px-4 py-2.5 text-base text-gray-500 font-medium"
                                                    as="select"
                                                    name="tipo"
                                                    id="tipo"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.tipo}
                                                    title="Digite o tipo"
                                                >
                                                    <option value="">
                                                        Selecione o tipo
                                                    </option>
                                                    {tipos.map(
                                                        (
                                                            tipo: any,
                                                            tidx: number,
                                                        ) => (
                                                            <option
                                                                key={tidx}
                                                                value={
                                                                    tipo.value
                                                                }
                                                            >
                                                                {tipo.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </Field>
                                                {errors.tipo &&
                                                    touched.tipo && (
                                                        <div className="text-sm text-secundary-red pl-1 pt-1">
                                                            {errors.tipo}
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

export default ProdEditar;
