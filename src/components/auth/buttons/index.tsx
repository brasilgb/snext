import React, {useCallback, useState} from 'react';
import Link from 'next/link';
import {
    IoArrowBack,
    IoAdd,
    IoTrash,
    IoPrint,
    IoPrintOutline,
    IoPrintSharp,
    IoImages,
} from 'react-icons/io5';
import {TbEdit} from 'react-icons/tb';
import {HiOutlineInformationCircle, HiTrash} from 'react-icons/hi2';
import sosapi from '@/services/sosapi';
import AMessage from '../message';
import { useRouter } from 'next/navigation';

interface ButtonsProps {
    label?: string;
    url?: string;
    param?: string;
    onclick?: any;
}

export const AButtomAdd = ({label, url}: ButtonsProps) => {

    return (
        <Link
            className="flex items-center justify-center transition-all duration-300 bg-primary-blue hover:bg-secundary-blue px-4 py-2 drop-shadow-md rounded-lg border-2 border-white"
            href={`${url}`}
        >
            <span className="text-lg font-medium text-white mr-1">+</span>
            <span className="text-base text-white font-medium">{label}</span>
        </Link>
    );
};

export const AButtomBack = ({label, url}: ButtonsProps) => {
    return (
        <Link
            className="flex items-center justify-center transition-all duration-300 bg-primary-blue hover:bg-secundary-blue px-4 py-2 drop-shadow-md rounded-lg border-2 border-white"
            href={`${url}`}
        >
            <IoArrowBack className="text-base text-white" />
            <span className="text-base text-white font-medium">{label}</span>
        </Link>
    );
};

export const AButtomEdit = ({label, url, param}: ButtonsProps) => {
    const router = useRouter();
    return (
        <Link
            className="flex items-center justify-center transition-all duration-300 bg-primary-yellow hover:bg-secundary-yellow px-4 py-2 drop-shadow-md rounded-lg border-2 border-white"
            href={{pathname: url, query: {q: param}}}
            // as={`${url}/${param}`}
            passHref
            // type='button'
            // onClick={() => 
            //     router.push(`${url}?id=${param}`)
            // }
        >
            <TbEdit className="text-lg text-gray-700" />
            <span className="text-sm text-gray-700 font-medium">{label}</span>
        </Link>
    );
};

export const AButtomImage = ({label, url, param}: ButtonsProps) => {
    return (
        <Link
            className="flex items-center justify-center transition-all duration-300 bg-lime-700 hover:bg-lime-600 px-4 py-2 drop-shadow-md rounded-lg border-2 border-white"
            href={{pathname: url, query: {q: param}}}
            // as={`${url}/${param}`}
            passHref
        >
            <IoImages className="text-lg text-gray-50" />
            <span className="text-sm text-gray-50 font-medium">{label}</span>
        </Link>
    );
};

export const AButtomPrint = ({label, onclick}: ButtonsProps) => {
    return (
        <button
            className="flex items-center justify-center transition-all duration-300 bg-secundary-blue hover:bg-terciary-blue px-4 py-2 drop-shadow-md rounded-lg border-2 border-white"
            onClick={onclick}
        >
            <IoPrintSharp className="text-lg text-gray-50" />
            <span className="text-sm text-gray-50 font-medium">{label}</span>
        </button>
    );
};

interface DeleteProps {
    deletemodal?: any;
    label?: string;
}

export const AButtomDelete = ({deletemodal, label}: DeleteProps) => {
    return (
        <>
            <button
                onClick={deletemodal}
                className="flex items-center justify-center transition-all duration-300 bg-primary-red hover:bg-secundary-red px-4 py-2 drop-shadow-md rounded-lg border-2 border-white"
            >
                <IoTrash className="text-base text-white" />
                <span className="text-sm text-white font-medium">{label}</span>
            </button>
        </>
    );
};
