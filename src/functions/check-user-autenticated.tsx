export const checkUserAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const userLogged = localStorage.getItem('Auth_user');
        return !!userLogged;
    }
};
