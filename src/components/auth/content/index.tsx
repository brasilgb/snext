import React from 'react';
import Header from '../header';
import Footer from '../footer';

interface AContentProps {
    children: React.ReactNode;
    open?: boolean;
}

const AContent = ({open, children}: AContentProps) => {
    return (
        <div
            className={`flex flex-col h-full relative right-0 transition-all duration-500 ${
                !open
                    ? 'left-20 w-[calc(100%-80px)]'
                    : 'left-72 w-[calc(100%-288px)]'
            }`}
        >
            <Header />
            <div className="flex flex-col flex-grow p-4">{children}</div>
            <Footer />
        </div>
    );
};

export default AContent;
