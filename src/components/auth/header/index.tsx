'use client';
import {useAuthContext} from '@/contexts/auth';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoChevronDown, IoLogOut, IoPerson } from 'react-icons/io5';

const Header = () => {
    const [navDropdown, setNavDropdown] = useState(false);
    const { user, logout } = useAuthContext();
    const handleLogout = () => {
        setNavDropdown(false);
        logout(user.token);
    };

    return (
        <>
            <div
                onClick={() => setNavDropdown(false)}
                className={`${navDropdown ? '' : 'hidden'
                    } fixed top-0 right-0 bottom-0 left-0 bg-transparent z-0`}
            />
            <div className="bg-gray-50 py-3 px-4 flex items-center justify-between shadow">
                <div></div>
                <div>
                    <div className="relative bg-primary-blue hover:bg-secundary-blue transition-all duration-300 border-2 px-2 border-white rounded-md flex items-center justify-center h-8 shadow">
                        <button
                            className="relative flex items-center justify-between"
                            onClick={() => setNavDropdown(!navDropdown)}
                        >
                            <IoPerson className="text-xl text-gray-50" />
                            <IoChevronDown
                                className={`${navDropdown ? '-rotate-180' : 'rotate-0'
                                    } transition-all duration-500 text-xl text-gray-50 ml-2 cursor-pointer`}
                            />
                        </button>
                        <ul
                            className={`${navDropdown ? 'max-h-44' : 'max-h-0 invisible'
                                } z-20 absolute transition-all duration-500 ease-in-out overflow-hidden top-12 right-0 w-56 px-2 bg-gray-50 border border-white rounded-md shadow-md`}
                        >
                            <li className="py-2">
                                <Link
                                    href={`usuarios/editar?q=${user && user.id}`}
                                    onClick={() => setNavDropdown(false)}
                                    className="flex items-center justify-start"
                                >
                                    <IoPerson className="text-lg text-secundary-blue" />
                                    <span className="pl-2">
                                        {user && user.name}
                                    </span>
                                </Link>
                            </li>
                            <li className="border-b" />
                            <li className="py-2">
                                <button
                                    onClick={() => handleLogout()}
                                    className="flex items-center justify-start"
                                >
                                    <IoLogOut className="text-lg text-secundary-blue" />
                                    <span className="pl-2">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
