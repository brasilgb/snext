import moment from 'moment';
import React from 'react';

type Props = {};

const Footer = (props: Props) => {
    return (
        <footer className="bg-gray-50 shadow">
            <p className="text-center text-sm text-gray-500">
                &copy; {moment().format('YYYY')} ABrasil
            </p>
        </footer>
    );
};

export default Footer;
