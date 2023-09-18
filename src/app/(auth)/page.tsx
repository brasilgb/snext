'use client';
import AKpi from '@/components/auth/kpi';
import {useAuthContext} from '@/contexts/auth';
import sosapi from '@/services/sosapi';
import React, {useEffect, useState} from 'react';
import {FaArrowCircleDown, FaArrowCircleRight, FaTools} from 'react-icons/fa';
import {
    FaBasketShopping,
    FaCalendarDays,
    FaMessage,
    FaUsers,
} from 'react-icons/fa6';
import {CgSpinnerTwo} from 'react-icons/cg';
import Boxorder from '@/components/auth/boxorder';

const Dashboard = () => {
    const {user, logout} = useAuthContext();
    const userToken = user?.token;
    const [clientes, setClientes] = useState<any>([]);
    const [ordens, setOrdens] = useState<any>([]);
    const [produtos, setProdutos] = useState<any>([]);
    const [agendas, setAgendas] = useState<any>([]);
    const [mensagens, setMensagens] = useState<any>([]);

    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);
    const [loading5, setLoading5] = useState(false);

    useEffect(() => {
        const getClientes = async () => {
            setLoading1(true);
            await sosapi
                .get(`allclientes`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setClientes(data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                })
                .finally(() => setLoading1(false));
        };
        getClientes();
    }, [userToken, logout]);

    useEffect(() => {
        const getOrdens = async () => {
            setLoading2(true);
            await sosapi
                .get(`allordens`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setOrdens(data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                })
                .finally(() => setLoading2(false));
        };
        getOrdens();
    }, [userToken]);

    useEffect(() => {
        const getProdutos = async () => {
            setLoading3(true);
            await sosapi
                .get(`allprodutos`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setProdutos(data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                })
                .finally(() => setLoading3(false));
        };
        getProdutos();
    }, [userToken]);

    useEffect(() => {
        const getMensagens = async () => {
            setLoading4(true);
            await sosapi
                .get(`allmensagens`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setMensagens(data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                })
                .finally(() => setLoading4(false));
        };
        getMensagens();
    }, [userToken]);

    useEffect(() => {
        const getAgendas = async () => {
            setLoading5(true);
            await sosapi
                .get(`allagendas`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    const {data} = response.data;
                    setAgendas(data);
                })
                .catch(err => {
                    const {status} = err.response;
                    if (status === 401) {
                        logout(user?.token);
                    }
                })
                .finally(() => setLoading5(false));
        };
        getAgendas();
    }, [userToken]);

    return (
        <>
            <div className="md:grid grid-cols-5 gap-4 p-4">
                <AKpi
                    label="Clientes"
                    value={clientes.length}
                    bgcolor="from-secundary-blue to-terciary-blue"
                    icon={props =>
                        loading1 ? (
                            <CgSpinnerTwo
                                {...props}
                                size={26}
                                color={'#fff'}
                                className="animate-spin"
                            />
                        ) : (
                            <FaUsers {...props} size={26} color={'#fff'} />
                        )
                    }
                />

                <AKpi
                    label="Ordens"
                    value={ordens.length}
                    bgcolor="from-primary-yellow to-secundary-yellow"
                    icon={props =>
                        loading2 ? (
                            <CgSpinnerTwo
                                {...props}
                                size={26}
                                color={'#fff'}
                                className="animate-spin"
                            />
                        ) : (
                            <FaTools {...props} size={26} color={'#fff'} />
                        )
                    }
                />

                <AKpi
                    label="Produtos"
                    value={produtos.length}
                    bgcolor="from-primary-green to-secundary-green"
                    icon={props =>
                        loading3 ? (
                            <CgSpinnerTwo
                                {...props}
                                size={26}
                                color={'#fff'}
                                className="animate-spin"
                            />
                        ) : (
                            <FaBasketShopping
                                {...props}
                                size={26}
                                color={'#fff'}
                            />
                        )
                    }
                />

                <AKpi
                    label="Agendamentos"
                    value={agendas.length}
                    bgcolor="from-primary-red to-secundary-red"
                    icon={props =>
                        loading4 ? (
                            <CgSpinnerTwo
                                {...props}
                                size={26}
                                color={'#fff'}
                                className="animate-spin"
                            />
                        ) : (
                            <FaCalendarDays
                                {...props}
                                size={26}
                                color={'#fff'}
                            />
                        )
                    }
                />

                <AKpi
                    label="Mensagens"
                    value={mensagens.length}
                    bgcolor="from-purple-700 to-purple-500"
                    icon={props =>
                        loading5 ? (
                            <CgSpinnerTwo
                                {...props}
                                size={26}
                                color={'#fff'}
                                className="animate-spin"
                            />
                        ) : (
                            <FaMessage {...props} size={26} color={'#fff'} />
                        )
                    }
                />
            </div>

            <div className="md:grid grid-cols-3 gap-2 mx-4">
                <Boxorder
                    ordens={ordens}
                    query={(fo: any) => fo.orcamento == 1}
                    title="Orçamentos gerados"
                    iconColor="#EF476F"
                    titleColor="text-secundary-red"
                />
                <Boxorder
                    ordens={ordens}
                    query={(fo: any) => fo.orcamento == 2}
                    title="Orçamentos aprovados"
                    iconColor="#03B00A"
                    titleColor="text-primary-green"
                />
                <Boxorder
                    ordens={ordens}
                    query={(fo: any) => fo.status == 5 || fo.status == 6}
                    title="Serviços concluídos"
                    iconColor="#01497C"
                    titleColor="text-secundary-blue"
                />
            </div>
        </>
    );
};

export default Dashboard;
