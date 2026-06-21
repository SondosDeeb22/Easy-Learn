// ============================================================
//? Importing
// ============================================================
import Header from '../../shared/components/Header';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/SideBar';
// ============================================================

export default function DashboardLayout() {
    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <Header />
            <div className="flex flex-row flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-[#F2F1ED]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

