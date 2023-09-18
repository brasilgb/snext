'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import { Field, Form, Formik } from 'formik';
import { IoCloseSharp, IoCloudUploadOutline, IoSave } from 'react-icons/io5';
import sosapi from '@/services/sosapi';
import AMessage from '@/components/auth/message';
import { CgSpinnerTwo } from 'react-icons/cg';
import { RiZoomInLine } from 'react-icons/ri';
import { AButtomBack } from '@/components/auth/buttons';
import { useAuthContext } from '@/contexts/auth';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import schema from './schema';

interface FormProps {
    ordem_id: string;
    imagem: any;
}

const Imagens = () => {
    const { user, logout } = useAuthContext();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [imgsSrc, setImgsSrc] = useState<any>([]);
    const [imagens, setImagens] = useState<any>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [selectedImageDb, setSelectedImageDb] = useState<any>(null);
    const searchParams = useSearchParams();
    const params = searchParams.get('q');

    useEffect(() => {
        const getImagens = async () => {
            await sosapi
                .get(`/imagens?ordem=${params}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const { data } = response.data;
                    setImagens(data);
                })
                .catch(err => {
                    const { status } = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getImagens();
    }, [params, user, logout]);

    const handleSubmitForm = useCallback(
        async (values: FormProps, { resetForm }: any) => {
            setLoading(true);
            const FilesData = new FormData();
            for (const file of values.imagem) {
                FilesData.append('imagem[]', file);
            }
            FilesData.append('ordem_id', values.ordem_id);
            await sosapi
                .post(`imagens`, FilesData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(async response => {
                    setImgsSrc([]);
                    const resp = await sosapi.get(`/imagens?ordem=${params}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    setImagens(resp.data.data);
                    const { message } = response.data;

                    setLoading(false);
                    setMessage(message);
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false);
                    }, 5000);
                })
                .catch(err => {
                    // console.log(err);
                })
                .finally(() => resetForm());
        },
        [params, user],
    );

    const onChange = (e: any, setFieldValue: any) => {
        setFieldValue('imagem', e.target.files);

        for (const file of e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImgsSrc((imgs: any) => [...imgs, reader.result]);
            };
            reader.onerror = () => {
                // console.log(reader.error);
            };
        }
    };

    const removeImg = (id: any) => {
        setImgsSrc((prevImages: any) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(id, 1);
            return updatedImages;
        });
    };

    const showImg = (id: any) => {
        setSelectedImage(imgsSrc[id]);
        setShowModal(true);
    };

    const showImgDb = (img: any) => {
        setSelectedImageDb(img);
        setShowModal(true);
    };
    const onDelete = useCallback(
        async (e: any, id: number) => {
            e.preventDefault();
            await sosapi
                .delete(`/imagens/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(async response => {
                    const resp = await sosapi.get(`/imagens?ordem=${params}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });

                    setImagens(resp.data.data);
                    setMessage(response.data.message);
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false);
                    }, 5000);
                });
        },
        [params, user],
    );
    return (
        <ABoxAll>
            <ABoxHeader>
                <div>
                    <AButtomBack url="/ordens" />
                </div>
            </ABoxHeader>
            <Formik
                validationSchema={schema}
                enableReinitialize
                initialValues={{
                    ordem_id: `${params}`,
                    imagem: null,
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
                                id="ordem_id"
                                name="ordem_id"
                                value={values.ordem_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="hidden"
                            />
                            <ABoxContent>
                                <div className="mt-4 px-2">
                                    <div className="flex flex-col w-full">
                                        <div className="w-full mb-4 md:mb-6">
                                            <label
                                                htmlFor="imagem"
                                                className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <IoCloudUploadOutline className="text-4xl text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">
                                                            Clique para fazer
                                                            upload das imagens
                                                            para a ordem de
                                                            serviço
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                        PNG ou JPG
                                                    </p>
                                                    {imgsSrc.length > 0 && (
                                                        <div className="text-lg text-gray-400 dark:text-gray-400">
                                                            {imgsSrc.length}{' '}
                                                            arquivos
                                                            selecionados
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    id="imagem"
                                                    name="imagem"
                                                    hidden
                                                    type="file"
                                                    multiple
                                                    onChange={(e: any) =>
                                                        onChange(
                                                            e,
                                                            setFieldValue,
                                                        )
                                                    }
                                                    title="Selecione a imagem"
                                                />
                                            </label>
                                            {errors.imagem &&
                                                touched.imagem && (
                                                    <div className="text-base text-secundary-red pl-1 pt-1">
                                                        {errors.imagem}
                                                    </div>
                                                )}
                                        </div>

                                        <div className="md:grid grid-cols-8 auto-cols-max gap-2">
                                            {imagens &&
                                                imagens.map(
                                                    (img: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="relative p-2 bg-white rounded border border-gray-200"
                                                        >
                                                            <span
                                                                onClick={() =>
                                                                    showImgDb(
                                                                        img,
                                                                    )
                                                                }
                                                                className="absolute cursor-pointer text-xl font-semibold bg-red-400 bg-opacity-70 left-3 top-3 rounded-full h-6 w-6 flex items-center justify-center text-white"
                                                            >
                                                                <RiZoomInLine />
                                                            </span>
                                                            <span
                                                                onClick={(
                                                                    e: any,
                                                                ) =>
                                                                    onDelete(
                                                                        e,
                                                                        img.id,
                                                                    )
                                                                }
                                                                className="absolute cursor-pointer text-xl font-semibold bg-red-500 bg-opacity-70 right-3 top-3 rounded-full h-6 w-6 flex items-center justify-center text-white"
                                                            >
                                                                <IoCloseSharp />
                                                            </span>
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_SITE_URL}/storage/ordens/${img.ordem_id}/${img.imagem}`}
                                                                alt="Images"
                                                                className=" h-48 w-48 object-center object-cover"
                                                                width={192}
                                                                height={50}
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                        </div>
                                        <div className="md:grid grid-cols-8 auto-cols-max gap-2">
                                            {imgsSrc.map(
                                                (link: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="relative p-2 bg-white rounded border border-gray-200"
                                                    >
                                                        <span
                                                            onClick={() =>
                                                                showImg(idx)
                                                            }
                                                            className="absolute cursor-pointer text-xl font-semibold bg-red-400 bg-opacity-70 left-3 top-3 rounded-full h-6 w-6 flex items-center justify-center text-white"
                                                        >
                                                            <RiZoomInLine />
                                                        </span>
                                                        <span
                                                            onClick={() =>
                                                                removeImg(idx)
                                                            }
                                                            className="absolute cursor-pointer text-xl font-semibold bg-red-500 bg-opacity-70 right-3 top-3 rounded-full h-6 w-6 flex items-center justify-center text-white"
                                                        >
                                                            <IoCloseSharp />
                                                        </span>
                                                        <Image
                                                            src={link}
                                                            alt="Images"
                                                            className=" h-48 w-48 object-center object-cover"
                                                            width={192}
                                                            height={50}
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                    {showModal && (
                                        <div className="min-w-screen h-screen fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-gray-600 bg-opacity-80">
                                            <div className="bg-white p-2 border border-gray-100 rounded">
                                                <div className="border-gray-100">
                                                    <div>
                                                        <span
                                                            onClick={() =>
                                                                setShowModal(
                                                                    false,
                                                                )
                                                            }
                                                            title="Fechar imagem"
                                                            className="cursor-pointer text-xl font-semibold bg-blue-500 bg-opacity-70 rounded-full h-6 w-6 flex items-center justify-center text-white mb-2"
                                                        >
                                                            <IoCloseSharp />
                                                        </span>
                                                        <Image
                                                            width="500"
                                                            height="200"
                                                            src={
                                                                selectedImage
                                                                    ? selectedImage
                                                                    : `${process.env.NEXT_PUBLIC_SITE_URL}/storage/ordens/${selectedImageDb.ordem_id}/${selectedImageDb.imagem}`
                                                            }
                                                            alt="Preview"
                                                            className="modal-image"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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

export default Imagens;
