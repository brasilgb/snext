'use client';
import {
    ABoxAll,
    ABoxContent,
    ABoxFooter,
    ABoxHeader,
} from '@/components/auth/box';
import {
    AButtomAdd,
    AButtomDelete,
    AButtomEdit,
} from '@/components/auth/buttons';
import AMessage from '@/components/auth/message';
import {ATable, ATd, ATh, ATr} from '@/components/auth/table';
import {useAuthContext} from '@/contexts/auth';
import sosapi from '@/services/sosapi';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {HiOutlineInformationCircle} from 'react-icons/hi2';
import {IoClose, IoSearch} from 'react-icons/io5';
import {RiArrowLeftFill, RiArrowRightFill} from 'react-icons/ri';
type Props = {};

const Produtos = (props: Props) => {
    const {user, logout} = useAuthContext();
    const [deleteModal, setDeleteModal] = useState(false);
    const [produtos, setProdutos] = useState<any>([]);
    const [produtosAll, setProdutosAll] = useState<any>([]);
    const [metaData, setMetaData] = useState<any>([]);
    const [linkValue, setLinkValue] = useState<number>(1);
    const [searchInput, setSearchInput] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteId, setIdDelete] = useState(null);
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [deleteProduto, setDeleteProduto] = useState(null);

    useEffect(() => {
        const getProdutos = async () => {
            await sosapi
                .get(`produtos?page=${linkValue}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    setProdutos(response.data.data);
                    let mdata = response.data.meta;
                    setMetaData(mdata);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getProdutos();
    }, [linkValue, user, logout]);

    const onsubmit = async (e: any) => {
        const form = e.target;
        const formFields = form.elements;
        let value = formFields[0].value;
        e.preventDefault();
        await sosapi
            .get(`produtos?q=${value}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then(response => {
                const { data, meta } = response.data;
                setProdutos(data);
                setMetaData(meta);
            });
        setSearchInput('');
        setShow(false);
    };

    useEffect(() => {
        const getProdutosAll = async () => {
            await sosapi
                .get(`allprodutos`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    setProdutosAll(response.data.data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getProdutosAll();
    }, [user, logout]);

    const handleProdutoSearch = (term: string) => {
        setSearchInput(term);
        if (term.length > 2) {
            setShow(true);
            const filteredData = produtosAll.filter((fn: any, i: number) => {
                return Object.values(fn.descricao)
                    .join('')
                    .toLowerCase()
                    .includes(searchInput.toLowerCase());
            });
            setFilteredResults(filteredData);
        }
    };

    const handleClick = async (e: any, nome: any) => {
        e.preventDefault();
        setSearchInput(nome);
        setShow(false);
    };

    const onDelete = useCallback(
        async (e: any) => {
            e.preventDefault();

            const response = await sosapi.delete(`/produtos/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const {message, status} = response.data;
            setDeleteProduto(deleteId);

            if (status === 200) {
                setTimeout(async () => {
                    const res = await sosapi.get(`produtos?page=${linkValue}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    setProdutos(res.data.data);
                }, 2000);
            }
            setMessage(message);
            setDeleteModal(false);
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
        },
        [deleteId, linkValue, user],
    );

    return (
        <ABoxAll>
            <ABoxHeader>
                <div className="flex-1">
                    <form onSubmit={onsubmit} className="">
                        <div className="relative">
                            <div
                                className={`flex items-center justify-start w-2/4 bg-gray-50 pr-2 ${
                                    show
                                        ? 'rounded-t-md border-2'
                                        : 'rounded-lg border-2'
                                } border-white shadow-md`}
                            >
                                <input
                                    className="px-2 py-1 w-full text-base bg-gray-50 border-0 focus:outline-none focus:ring-0 text-gray-500"
                                    type="text"
                                    value={searchInput}
                                    placeholder="Pesquisar por produto"
                                    onChange={e =>
                                        handleProdutoSearch(e.target.value)
                                    }
                                    onClick={() => {
                                        setSearchInput('');
                                        setShow(false);
                                    }}
                                />
                                <div>
                                    <button className="border-l py-2">
                                        <IoSearch className="ml-2 text-2xl text-terciary-blue" />
                                    </button>
                                </div>
                            </div>
                            <div
                                className={`absolute ${
                                    show
                                        ? 'max-h-60 rounded-b-lg overflow-auto'
                                        : 'max-h-0 invisible'
                                } transition-all duration-200 ease-in-out w-2/4  top-12 bg-gray-50 border-2 border-white shadow-md p-2`}
                            >
                                <ul className={`mb-2 ${!show && 'invisible'}`}>
                                    <li>
                                        <IoClose
                                            onClick={() => setShow(false)}
                                            className="absolute top-1 right-1 text-lg text-primary-red bg-white border cursor-pointer"
                                        />
                                    </li>
                                    {filteredResults.map(
                                        (re: any, ir: number) => (
                                            <li
                                                key={ir}
                                                className="py-0.5 border-b"
                                            >
                                                <button
                                                    className="text-sm text-gray-500 w-full text-left"
                                                    onClick={e =>
                                                        handleClick(
                                                            e,
                                                            re.descricao,
                                                        )
                                                    }
                                                >
                                                    {re.descricao}
                                                </button>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex-1 flex items-center justify-end">
                    <AButtomAdd
                        label="Novo produto"
                        url="/produtos/cadastrar"
                    />
                </div>
            </ABoxHeader>
            {showMessage && (
                <AMessage
                    showmessage={() => setShowMessage(false)}
                    message={message}
                />
            )}
            <ABoxContent>
                <ATable>
                    <ATr head={true}>
                        <ATh>Cód. Produto</ATh>
                        <ATh>Descrição</ATh>
                        <ATh>Estoque</ATh>
                        <ATh>Preço</ATh>
                        <ATh>Cadastro</ATh>
                        <ATh>
                            <></>
                        </ATh>
                    </ATr>
                    {produtos.map((produto: any, icl: number) => (
                        <ATr
                            key={icl}
                            line={icl % 2}
                            lineDeleted={
                                deleteProduto === produto.id ? true : false
                            }
                        >
                            <ATd>{('000000' + produto.id).slice(-6)}</ATd>
                            <ATd>{produto.descricao}</ATd>
                            <ATd>{produto.estmaximo}</ATd>
                            <ATd>{produto.valvenda}</ATd>
                            <ATd>
                                {moment(produto.cadastro).format('DD/MM/YYYY')}
                            </ATd>
                            <ATd>
                                <div className="flex items-center justify-end gap-x-2">
                                    <AButtomEdit
                                        label=""
                                        url="/produtos/editar"
                                        param={produto.id}
                                    />
                                    <AButtomDelete
                                        deletemodal={() => {
                                            setDeleteModal(true);
                                            setIdDelete(produto.id);
                                        }}
                                    />
                                </div>
                            </ATd>
                        </ATr>
                    ))}
                </ATable>
            </ABoxContent>

            <ABoxFooter>
                {/* <div>{metaData.links.length - 3} ---- {metaData.per_page}</div> */}
                {metaData.links &&
                    metaData.links.length - 3 === metaData.per_page && (
                        <div className="flex items-center justify-center gap-x-2">
                            {metaData.links && (
                                <button
                                    title="Página anterior"
                                    disabled={
                                        parseInt(metaData.current_page) - 1 ===
                                        0
                                            ? true
                                            : false
                                    }
                                    onClick={() =>
                                        setLinkValue(
                                            parseInt(metaData.current_page) - 1,
                                        )
                                    }
                                    className={`w-10 h-10 flex items-center justify-center ${
                                        parseInt(metaData.current_page) - 1 ===
                                        0
                                            ? 'text-gray-200'
                                            : 'bg-gray-50 text-terciary-blue'
                                    } rounded-md border-2 border-white shadow`}
                                >
                                    <RiArrowLeftFill className="text-lg" />
                                </button>
                            )}

                            {metaData.links &&
                                metaData.links
                                    .filter(
                                        (u: any, i: number) =>
                                            i !== 0 &&
                                            i !== metaData.links.length - 1,
                                    )
                                    .map((link: any, il: number) => (
                                        <button
                                            key={il}
                                            onClick={() =>
                                                setLinkValue(
                                                    parseInt(link.label),
                                                )
                                            }
                                            className={`w-10 h-10 flex items-center justify-center ${
                                                link.active
                                                    ? 'bg-terciary-blue text-white'
                                                    : 'bg-gray-100 text-terciary-blue'
                                            } rounded-md border-2 border-white shadow`}
                                        >
                                            <span
                                                className={` text-sm font-medium`}
                                            >
                                                {link.label}
                                            </span>
                                        </button>
                                    ))}

                            {metaData.links && (
                                <button
                                    title="Próxima página"
                                    disabled={
                                        parseInt(metaData.current_page) ===
                                        parseInt(metaData.last_page)
                                            ? true
                                            : false
                                    }
                                    onClick={() =>
                                        setLinkValue(
                                            parseInt(metaData.current_page) + 1,
                                        )
                                    }
                                    className={`w-10 h-10 flex items-center justify-center ${
                                        parseInt(metaData.current_page) ===
                                        parseInt(metaData.last_page)
                                            ? 'text-gray-200'
                                            : 'bg-gray-50 text-terciary-blue'
                                    } rounded border-2 border-white shadow`}
                                >
                                    <RiArrowRightFill className="text-lg" />
                                </button>
                            )}
                        </div>
                    )}
            </ABoxFooter>
            {deleteModal && (
                <div className="min-w-screen h-screen fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
                    <div className="absolute bg-[#00000007] inset-0 z-0"></div>
                    <div className="w-full animate__animated animate__fadeIn max-w-lg p-2 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
                        <div className="">
                            {/* <!--body--> */}
                            <div className="text-center p-2 flex-auto justify-center">
                                <div className="flex flex-col items-center justify-center">
                                    <HiOutlineInformationCircle className="text-5xl text-red-500" />
                                    {/* <HiTrash className="text-lg text-red-500" /> */}
                                </div>

                                <h2 className="text-xl font-bold py-4 ">
                                    Têm certeza?
                                </h2>
                                <p className="text-sm text-gray-500 px-8">
                                    Quer excluir este produto? Este processo não
                                    pode ser desfeito.
                                </p>
                            </div>
                            <form onSubmit={onDelete}>
                                <div className="p-3  mt-2 text-center space-x-4 md:block">
                                    <button
                                        onClick={() => setDeleteModal(false)}
                                        className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">
                                        Excluir
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </ABoxAll>
    );
};

export default Produtos;
