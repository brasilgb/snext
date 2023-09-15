'use client';
export const listUserAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const userLogged: any = localStorage.getItem('Auth_user');
        return JSON.parse(userLogged);
    }
};
