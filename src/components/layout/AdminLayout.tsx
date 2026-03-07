import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
    return (
        <div className="min-h-screen flex text-slate-900" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)' }}>
            <Helmet><title>{title} | MakeMyStay.ai</title></Helmet>

            <AdminSidebar />

            <div className="flex-1 flex flex-col ml-64 min-h-screen">
                <AdminHeader />
                <main className="flex-1 p-6 lg:p-8 w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
