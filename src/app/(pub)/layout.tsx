import '../../app/globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Acesso ao Sistema',
    description: 'Generated by create next app',
};

export default function LoginLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main>
                    <div className="h-screen flex items-center justify-center bg-primary-blue">
                        <div className="w-3/12 p-0.5 bg-gray-200 shadow-md shadow-gray-800 rounded-md ">
                            <div className="h-full bg-white bg-opacity-90 rounded-md p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
