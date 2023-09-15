'use client';
import React, {useState} from 'react';
import Sidebar from '../sidebar';
import AContent from '../content';

interface MainProps {
    children?: React.ReactNode;
    menuOpen?: boolean;
}

const Main = ({children}: MainProps) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(true);
    return (
        <>
            <Sidebar open={menuOpen} setOpen={setMenuOpen} />
            <AContent open={menuOpen}>{children}</AContent>
        </>
    );
};

export default Main;
