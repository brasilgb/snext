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

    useEffect(() => {
        const loadStorage = async () => {
            const recoveredUser = localStorage.getItem('Auth_user');
            if (recoveredUser) {
                setUser(JSON.parse(recoveredUser));
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
                    const { status, data } = response.data;
                    if (status === 200) {
                        setLoginMessage('Aguarde redirecionando...');
                        let userData = {
                            id: data.id,
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
                    const { message } = err.response.data;
                    setLoginMessage(message);
                })
                .finally(() => setLoading(false));
        },
        [push],
    );

    const logout = useCallback(
        async (token: string) => {
            await sosapi
                .post('logout', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setLoginMessage('');
                })
                .catch((err) => {
                    const { status } = err.response;
                    if (status === 401) {
                        localStorage.removeItem('Auth_user');
                        setUser(null);
                        push('/login');
                    }
                }).finally(() =>  setLoginMessage(''));
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
