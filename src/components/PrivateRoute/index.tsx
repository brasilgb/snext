import React, {ReactNode, useEffect} from 'react';

import {useRouter} from 'next/navigation';
import { APP_ROUTES } from "@/constants/app-routes";
import { checkUserAuthenticated } from "@/functions/check-user-autenticated";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({children}: PrivateRouteProps) => {
    const {push} = useRouter();
    const isUserAutenticated = checkUserAuthenticated();

    useEffect(() => {
        if (!isUserAutenticated) {
            push(APP_ROUTES.public.login);
        }
    }, [isUserAutenticated, push]);

    return (
        <>
            {!isUserAutenticated && null}
            {isUserAutenticated && children}
        </>
    );
};

export default PrivateRoute;
