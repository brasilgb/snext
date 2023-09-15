import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {IoChevronBackOutline, IoChevronForwardOutline} from 'react-icons/io5';

interface PaginationProps {
    data: any;
}

const APagination = ({data}: PaginationProps) => {
    const [lData, setLData] = useState<any>([]);
    useEffect(() => {
        if (data.length > 0) setLData([...data.links]);
    }, [data]);

    const clearLinks = lData;
    clearLinks.shift();
    clearLinks.pop();
    // console.log(clearLinks);
    // clearLinks.map((l:any, i:number) => (console.log(l.url)));
    return (
        <>
            {lData.length > 0 && (
                <div className="flex py-2">
                    {data.prev_page_url && (
                        <Link
                            href={data.prev_page_url}
                            className="flex items-center justify-center mr-1 w-10 h-10 text-gray-500 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white duration-500 border-2 border-white shadow"
                        >
                            <IoChevronBackOutline />
                        </Link>
                    )}

                    {clearLinks.map((link: any, index: number) => (
                        <Link
                            key={index}
                            href={link.url}
                            className={
                                link.active
                                    ? 'mx-1 flex items-center justify-center w-10 h-10 text-gray-50 bg-blue-600 rounded-lg border-2 border-white shadow'
                                    : 'mx-1 flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-100 hover:bg-blue-600 hover:text-white duration-500 rounded-lg border-2 border-white shadow'
                            }
                        >
                            {link.label}
                        </Link>
                    ))}

                    {data.next_page_url && (
                        <Link
                            href={data.next_page_url}
                            className="flex items-center justify-center ml-1 w-10 h-10 text-gray-500 hover:bg-blue-600 hover:text-white duration-500 rounded-lg bg-gray-100 border-2 border-white shadow"
                        >
                            <IoChevronForwardOutline />
                        </Link>
                    )}
                </div>
            )}
        </>
    );
};

export default APagination;
