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
    AButtomImage,
} from '@/components/auth/buttons';
import AMessage from '@/components/auth/message';
import {ATable, ATd, ATh, ATr} from '@/components/auth/table';
import PrintRecibo from '@/components/printrecibo';
import {useAuthContext} from '@/contexts/auth';
import sosapi from '@/services/sosapi';
import moment from 'moment';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {HiOutlineInformationCircle} from 'react-icons/hi2';
import {IoPrintSharp, IoSearch} from 'react-icons/io5';
import {RiArrowLeftFill, RiArrowRightFill} from 'react-icons/ri';
import ReactToPrint from 'react-to-print';

const ComponentToPrint = forwardRef((props: any, ref: any) => {
    const {value} = props;

    return (
        <div ref={ref}>
            <PrintRecibo value={value} />
        </div>
    );
});
ComponentToPrint.displayName = 'ComponentToPrint';

const ComponentToPrintWrapper = ({item}: any) => {
    const componentRef = useRef(null);
    return (
        <div style={{display: 'flex'}}>
            <ReactToPrint
                trigger={() => (
                    <button className="flex items-center justify-center transition-all duration-300 bg-secundary-blue hover:bg-terciary-blue px-4 py-2 drop-shadow-md rounded-lg border-2 border-white">
                        <IoPrintSharp className="text-lg text-gray-50" />
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

const Ordens = () => {
    const printRef = useRef<any>();

    const {user, logout} = useAuthContext();
    const [deleteModal, setDeleteModal] = useState(false);
    const [ordens, setOrdens] = useState<any>([]);
    const [clientesAll, setClientesAll] = useState<any>([]);
    const [metaData, setMetaData] = useState<any>([]);
    const [linkValue, setLinkValue] = useState<number>(1);
    const [searchInput, setSearchInput] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteId, setIdDelete] = useState(null);
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [deleteEffect, setDeleteEffect] = useState(null);

    useEffect(() => {
        const getOrdens = async () => {
            await sosapi
                .get(`ordens?page=${linkValue}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const {data, meta} = response.data;
                    setOrdens(data);
                    setMetaData(meta);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getOrdens();
    }, [linkValue, user, logout]);

    const onsubmit = async (e: any) => {
        const form = e.target;
        const formFields = form.elements;
        let value = formFields[0].value;
        e.preventDefault();
        await sosapi
            .get(`ordens?q=${value}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then(response => {
                const {data, meta} = response.data;
                setOrdens(data);
                setMetaData(meta);
            });
        setSearchInput('');
        setShow(false);
    };

    useEffect(() => {
        const getClientesAll = async () => {
            await sosapi
                .get(`allclientes`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setClientesAll(data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                });
        };
        getClientesAll();
    }, [user, logout]);

    const handleClienteSearch = (term: string) => {
        setShow(true);
        setSearchInput(term);
        const filteredData = clientesAll.filter((fn: any, i: number) => {
            return Object.values(fn.nome)
                .join('')
                .toLowerCase()
                .includes(searchInput.toLowerCase());
        });
        setFilteredResults(filteredData);
    };

    const onDelete = useCallback(
        async (e: any) => {
            e.preventDefault();

            const response = await sosapi.delete(`/ordens/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const {message, status} = response.data;
            setDeleteEffect(deleteId);

            if (status === 200) {
                setTimeout(async () => {
                    const res = await sosapi.get(`ordens?page=${linkValue}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    const {data} = res.data;
                    setOrdens(data);
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

    const setcomunicado = (aviso: any) => {
        let av;
        switch (aviso) {
            case 1:
                av = 'Ordem aberta';
                break;
            case 2:
                av = 'Aguardando Avaliação';
                break;
            case 3:
                av = 'Ordem fechada';
                break;
            case 4:
                av = 'Executando reparo';
                break;
            case 5:
                av = '(CN)Serviço concluído';
                break;
            case 6:
                av = '(CA)Serviço concluído';
                break;
            default:
                av = 'Entregue ao cliente';
        }
        return av;
    };

    return (
        <ABoxAll>
            <ABoxHeader>
                <div className="flex-1">
                    <form onSubmit={onsubmit} className="">
                        <div className="relative">
                            <div className="flex items-center justify-start w-2/4 bg-gray-50 px-2 rounded-lg border-2 border-white shadow-md">
                                <input
                                    className="px-2 py-1 w-full text-base bg-gray-50 border-0 focus:outline-none focus:ring-0"
                                    type="text"
                                    value={searchInput}
                                    placeholder="Pesquisar por ordem"
                                    onChange={e =>
                                        handleClienteSearch(e.target.value)
                                    }
                                    onClick={() => {
                                        setSearchInput('');
                                        setShow(false);
                                    }}
                                />
                                <div>
                                    <button className="border-l py-2">
                                        <IoSearch className="ml-2 text-2xl text-primary-blue" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex-1 flex items-center justify-end">
                    <AButtomAdd label="Nova ordem" url="/ordens/cadastrar" />
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
                        <ATh>Nº. Ordem</ATh>
                        <ATh>Cliente</ATh>
                        <ATh>Telefone</ATh>
                        <ATh>Recebimento</ATh>
                        <ATh>Equipamento</ATh>
                        <ATh>Status</ATh>
                        <ATh>Entrega</ATh>
                        <ATh>
                            <></>
                        </ATh>
                    </ATr>
                    {ordens && ordens.map((ordem: any, icl: number) => (
                        <ATr
                            key={icl}
                            line={icl % 2}
                            lineDeleted={
                                deleteEffect === ordem.id ? true : false
                            }
                        >
                            <ATd>{('000000' + ordem.id).slice(-6)}</ATd>
                            <ATd>{ordem.cliente.nome}</ATd>
                            <ATd>{ordem.cliente.telefone}</ATd>
                            <ATd>
                                {moment(ordem.dtentrada).format('DD/MM/YYYY')}
                            </ATd>
                            <ATd>{ordem.equipamento}</ATd>
                            <ATd>
                                <span
                                    className={`${
                                        ordem.status === 1
                                            ? 'text-primary-red'
                                            : ordem.status === 3 ||
                                              ordem.status === 7
                                            ? 'text-primary-green'
                                            : 'text-primary-yellow'
                                    }`}
                                >
                                    {setcomunicado(ordem.status)}
                                </span>
                            </ATd>
                            <ATd>
                                {ordem.status === 7
                                    ? moment(ordem.dtentrega).format(
                                          'DD/MM/YYYY DD:mm:ss',
                                      )
                                    : '__/__/____'}
                            </ATd>
                            <ATd>
                                <div className="flex items-center justify-end gap-x-2">
                                    <div ref={printRef}>
                                        <ComponentToPrintWrapper
                                            key={icl}
                                            item={ordem.id}
                                        />
                                    </div>
                                    <AButtomImage
                                        label=""
                                        url="/ordens/imagens"
                                        param={ordem.id}
                                    />
                                    <AButtomEdit
                                        label=""
                                        url="/ordens/editar"
                                        param={ordem.id}
                                    />
                                    <AButtomDelete
                                        deletemodal={() => {
                                            setDeleteModal(true);
                                            setIdDelete(ordem.id);
                                        }}
                                    />
                                </div>
                            </ATd>
                        </ATr>
                    ))}
                </ATable>
            </ABoxContent>

            <ABoxFooter>
                {metaData && metaData.links &&
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
                                    Quer excluir este ordem? Este processo não
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

export default Ordens;
