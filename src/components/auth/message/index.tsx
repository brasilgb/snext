import React from 'react';
import {IoCheckmarkCircle, IoClose} from 'react-icons/io5';

interface AMessageProps {
    showmessage?: any;
    message?: string;
}

const AMessage = ({showmessage, message}: AMessageProps) => {
    return (
        <div
            className={`fixed z-40 transition-all duration-300 right-6 top-20 rounded-md border-2 border-white shadow-lg bg-primary-green px-2 py-4`}
        >
            <div className="flex items-center justify-start">
                <IoCheckmarkCircle className="text-lg text-white mr-2" />
                <h1 className="text-gray-50 text-base font-bold border-r border-r-secundary-green pr-2">
                    {message}
                </h1>
                <IoClose
                    className="text-lg text-white cursor-pointer ml-1"
                    onClick={showmessage}
                />
            </div>
        </div>
    );
};

export default AMessage;
