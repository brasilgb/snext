'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {BsArrowLeftShort} from 'react-icons/bs';
import {RiDashboardFill} from 'react-icons/ri';
import {FaTools, FaUserAlt, FaUsers} from 'react-icons/fa';
import {
    FaBasketShopping,
    FaCalendarDays,
    FaChevronDown,
    FaFileLines,
    FaMessage,
    FaSliders,
} from 'react-icons/fa6';
import {HiAtSymbol, HiBuildingOffice, HiServer} from 'react-icons/hi2';
import {AiFillNotification, AiFillPrinter, AiFillTags} from 'react-icons/ai';
import sosapi from '@/services/sosapi';
import {useAuthContext} from '@/contexts/auth';
import Image from 'next/image';

interface SideProps {
    open?: boolean;
    setOpen?: any;
}

const Sidebar = ({setOpen, open}: SideProps) => {
    const {user, logout} = useAuthContext();
    const pathname = usePathname();
    const [navDropdown, setNavDropdown] = useState(false);
    const [empresas, setEmpresas] = useState<any>([]);
    const [usuarios, setUsuarios] = useState<any>([]);

    useEffect(() => {
        const getEmpresas = async () => {
            await sosapi
                .get('/empresa', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then(response => {
                    setEmpresas(response.data.data[0]);
                })
                .catch(err => {
                    // console.log(err);
                });
        };
        getEmpresas();
    }, [user, logout]);

    return (
        <aside
            className={`${
                open ? 'w-72' : 'w-20'
            } z-20 fixed top-0 left-0 h-full transition-all duration-300 bg-gradient-to-b from-primary-blue via-terciary-blue to-secundary-blue shadow-lg p-5 pt-8`}
        >
            <div>
                <BsArrowLeftShort
                    onClick={() => setOpen(!open)}
                    className={`${
                        open ? 'rotate-0' : 'rotate-180'
                    } duration-300 absolute cursor-pointer bg-white border-4 border-primary-blue text-primary-blue rounded-full text-3xl -right-3 top-3`}
                />
            </div>
            <div className="inline-flex items-center">
                <span className={`w-10 h-10 rounded-full cursor-pointer float-left mr-2 duration-500 ${open && 'rotate-[360deg]'}`}>
                    <Image
                        src={
                            empresas.logo
                                ? `${process.env.NEXT_PUBLIC_SITE_URL}/storage/uploads/${empresas.logo}`
                                : `${process.env.NEXT_PUBLIC_SITE_URL}/storage/image/notimage.jpg`
                        }
                        alt="logo"
                        className="h-10"
                        width={40}
                        height={40}
                    />
                </span>
                <h1
                    className={`text-white origen-left font-medium text-xl duration-300 ${
                        !open && 'scale-0'
                    }`}
                >
                    SOSServices
                </h1>
            </div>
            <div className="mt-8">
                <ul className="">
                    <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/'
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/'}
                            title="Dashboard"
                        >
                            <span className="text-base block float-left">
                                <RiDashboardFill />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Dashboard
                            </span>
                        </Link>
                    </li>
                    <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/clientes' ||
                                pathname === '/clientes/cadastrar' ||
                                pathname ===
                                    '/clientes/editar/' + pathname.split('/')[3]
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/clientes'}
                            title="Clientes"
                        >
                            <span className="text-base block float-left">
                                <FaUsers />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Clientes
                            </span>
                        </Link>
                    </li>
                    <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/ordens' ||
                                pathname === '/ordens/cadastrar' ||
                                pathname ===
                                    '/ordens/editar/' +
                                        pathname.split('/')[3] ||
                                pathname ===
                                    '/ordens/imagens/' + pathname.split('/')[3]
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/ordens'}
                            title="Ordens de serviço"
                        >
                            <span className="text-base block float-left">
                                <FaTools />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Ordens
                            </span>
                        </Link>
                    </li>

                    <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/produtos' ||
                                pathname === '/produtos/cadastrar' ||
                                pathname ===
                                    '/produtos/editar/' + pathname.split('/')[3]
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/produtos'}
                            title="Produtos"
                        >
                            <span className="text-base block float-left">
                                <FaBasketShopping />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Produtos
                            </span>
                        </Link>
                    </li>

                    <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/agendas' ||
                                pathname === '/agendas/cadastrar' ||
                                pathname ===
                                    '/agendas/editar/' + pathname.split('/')[3]
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/agendas'}
                            title="Agenda"
                        >
                            <span className="text-base block float-left">
                                <FaCalendarDays />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Agenda
                            </span>
                        </Link>
                    </li>

                    <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/mensagens' ||
                                pathname === '/mensagens/cadastrar' ||
                                pathname ===
                                    '/mensagens/editar/' +
                                        pathname.split('/')[3]
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/mensagens'}
                            title="Mensagens"
                        >
                            <span className="text-base block float-left">
                                <FaMessage />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Mensagens
                            </span>
                        </Link>
                    </li>
                    <li
                        onClick={() => setNavDropdown(!navDropdown)}
                        className={`mt-2 flex-col items-center justify-between hover:bg-white hover:text-secundary-blue transition-all duration-300
                         ${
                             navDropdown ||
                             pathname === '/empresa' ||
                             pathname === '/email' ||
                             pathname === '/etiquetas'
                                 ? 'bg-white text-secundary-blue'
                                 : 'text-white'
                         } p-2 rounded cursor-pointer transition-all duration-500`}
                    >
                        <div className="flex items-center justify-between gap-x-4">
                            <span className={`text-base block float-left ${!open && 'ml-1'}`}>
                                <FaSliders />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Configurações
                            </span>
                            <FaChevronDown
                                size={12}
                                className={`${
                                    navDropdown ? '-rotate-180' : 'rotate-0'
                                } transition-all duration-500`}
                            />
                        </div>

                        <ul
                            className={`bg-white border-t border-t-gray-200 mt-2 ${
                                navDropdown ? '' : 'hidden'
                            } transition-all duration-600`}
                        >
                            <li className="mt-2">
                                <Link
                                    onClick={() => setNavDropdown(false)}
                                    className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                        open ? 'p-2' : 'px-0 py-2'
                                    } rounded`}
                                    href={'/empresa'}
                                    title="Empresa"
                                >
                                    <span className="text-base block float-left">
                                        <HiBuildingOffice />
                                    </span>
                                    <span
                                        className={`text-base font-medium flex-1 duration-300 ${
                                            !open && 'hidden'
                                        }`}
                                    >
                                        Empresa
                                    </span>
                                </Link>
                            </li>
                            <li className="">
                                <Link
                                    onClick={() => setNavDropdown(false)}
                                    className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                        open ? 'p-2' : 'px-0 py-2'
                                    } rounded`}
                                    href={'/email'}
                                    title="E-mail"
                                >
                                    <span className="text-base block float-left">
                                        <HiAtSymbol />
                                    </span>
                                    <span
                                        className={`text-base font-medium flex-1 duration-300 ${
                                            !open && 'hidden'
                                        }`}
                                    >
                                        E-mail
                                    </span>
                                </Link>
                            </li>

                            <li className="">
                                <Link
                                    onClick={() => setNavDropdown(false)}
                                    className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                        open ? 'p-2' : 'px-0 py-2'
                                    } rounded`}
                                    href={'/impressoes'}
                                    title="E-mail"
                                >
                                    <span className="text-base block float-left">
                                        <AiFillPrinter />
                                    </span>
                                    <span
                                        className={`text-base font-medium flex-1 duration-300 ${
                                            !open && 'hidden'
                                        }`}
                                    >
                                        Impressões
                                    </span>
                                </Link>
                            </li>

                            <li className="">
                                <Link
                                    onClick={() => setNavDropdown(false)}
                                    className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                        open ? 'p-2' : 'px-0 py-2'
                                    } rounded`}
                                    href={'/etiquetas'}
                                    title="E-mail"
                                >
                                    <span className="text-base block float-left">
                                        <AiFillTags />
                                    </span>
                                    <span
                                        className={`text-base font-medium flex-1 duration-300 ${
                                            !open && 'hidden'
                                        }`}
                                    >
                                        Etiquetas
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/usuarios' ||
                                pathname === '/usuarios/cadastrar' ||
                                pathname ===
                                    '/usuarios/editar/' + pathname.split('/')[3]
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/usuarios'}
                            title="Usuários"
                        >
                            <span className="text-base block float-left">
                                <FaUserAlt />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Usuários
                            </span>
                        </Link>
                    </li>
                    {/* <li className="mt-2">
                        <Link
                            onClick={() => setNavDropdown(false)}
                            className={`flex items-center justify-center gap-x-4 hover:bg-white hover:text-secundary-blue transition-all duration-300 ${
                                pathname === '/relatorios'
                                    ? 'bg-white text-secundary-blue'
                                    : 'text-white'
                            } p-2 rounded`}
                            href={'/relatorios'}
                            title="Relatórios"
                        >
                            <span className="text-base block float-left">
                                <FaFileLines />
                            </span>
                            <span
                                className={`text-base font-medium flex-1 duration-300 ${
                                    !open && 'hidden'
                                }`}
                            >
                                Relatórios
                            </span>
                        </Link>
                    </li> */}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
