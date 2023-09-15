import sosapi from '@/services/sosapi';
import {Anybody} from 'next/font/google';
import React, {useEffect, useState} from 'react';
import {IoSearch} from 'react-icons/io5';

interface FormProps {
    placeHolder?: string;
    onsubmit?: any;
    resetform?: boolean;
}

export const ASearchForm = ({placeHolder}: FormProps) => {
    return (
        <form>
            <div className="flex items-center justify-start w-2/4 bg-gray-50 px-2 rounded-lg border-2 border-white shadow-md">
                <input
                    className="px-2 py-1 w-full text-base bg-gray-50 outline-none"
                    type="text"
                    placeholder={placeHolder}
                />
                <div className="border-l py-2">
                    <IoSearch className="ml-2 text-2xl text-primary-blue" />
                </div>
            </div>
        </form>
    );
};

export const ASearchFormClient = ({
    placeHolder,
    onsubmit,
    resetform,
}: FormProps) => {
    const [clientes, setClientes] = useState<any>([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const getClientes = async () => {
            await sosapi
                .get(`allclientes`)
                .then(response => {
                    setClientes(response.data.data);
                })
                .catch(err => {
                    console.log(err.response.status);
                });
        };
        getClientes();
    }, []);

    const handleClienteSearch = (term: string) => {
        setShow(true);
        setSearchInput(term);
        const filteredData = clientes.filter((fn: any, i: number) => {
            return Object.values(fn.nome)
                .join('')
                .toLowerCase()
                .includes(searchInput.toLowerCase());
        });
        setFilteredResults(filteredData);
    };

    const handleClick = async (e: any, nome: any) => {
        e.preventDefault();
        setSearchInput(nome);
        setShow(false);
    };

    return (
        <form onSubmit={onsubmit} className="">
            <div className="relative">
                <div className="flex items-center justify-start w-2/4 bg-gray-50 px-2 rounded-lg border-2 border-white shadow-md">
                    <input
                        className="px-2 py-1 w-full text-base bg-gray-50 outline-none"
                        type="text"
                        value={searchInput}
                        placeholder={placeHolder}
                        onChange={e => handleClienteSearch(e.target.value)}
                        onClick={() => setSearchInput('')}
                    />
                    <div>
                        <button className="border-l py-2">
                            <IoSearch className="ml-2 text-2xl text-primary-blue" />
                        </button>
                    </div>
                </div>
                {show && (
                    <div className="absolute max-h-60 top-12 bg-gray-50 w-full rounded border-2 border-white shadow-md p-4 overflow-auto">
                        <ul>
                            {filteredResults.map((re: any, ir: number) => (
                                <li key={ir} className="py-0.5 border-b">
                                    <button
                                        onClick={e => handleClick(e, re.nome)}
                                    >
                                        {re.nome}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </form>
    );
};
