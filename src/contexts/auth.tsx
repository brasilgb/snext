'use client';
import sosapi from '@/services/sosapi';
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';
const AuthContext = createContext({} as any);

interface AuthContextProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthContextProps) => {
    const { push } = useRouter();
    const [loginMessage, setLoginMessage] = useState<any>('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [tokenUser, setTokenUser] = useState<any>(null);

    useEffect(() => {
        const loadStorage = async () => {
            const recoveredUser = localStorage.getItem('Auth_user');
            if (recoveredUser) {
                setUser(JSON.parse(recoveredUser));
                setTokenUser(JSON.parse(recoveredUser)[0]);
            }
        };
        loadStorage();
    }, []);

    const login = useCallback(
        async ({ email, password }: any) => {
            setLoading(true);
            await sosapi
                .post('login', {
                    email: email,
                    password: password,
                })
                .then(response => {
                    const { message, status, data } = response.data;
                    if (status === 200) {
                        setLoginMessage('Aguarde redirecionando...');
                        let userData = {
                            name: data.name,
                            email: data.email,
                            token: data.token,
                        };
                        localStorage.setItem(
                            'Auth_user',
                            JSON.stringify(userData),
                        );
                        setUser(userData);
                        return push('/');
                    }
                })
                .catch(err => {
                    const { message, status } = err.response.data;
                    setLoginMessage(message);
                })
                .finally(() => setLoading(false));
        },
        [push],
    );

    const logout = useCallback(
        async (token: string) => {
            console.log(token)
            await sosapi
                .post('logout', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((err) => {
                    const { status } = err.response;
                    if (status === 401) {
                        localStorage.removeItem('Auth_user');
                        setUser(null);
                        push('/login');
                    }
                });
        },
        [push],
    );

    return (
        <AuthContext.Provider
            value={{
                authenticated: !!user,
                user,
                login,
                logout,
                loading,
                setLoading,
                loginMessage,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
