// ============================================================
//? Importing
// ============================================================
import Header from '../../shared/components/Header';
import { Outlet } from 'react-router-dom';

// ============================================================

export default function DashboardLayout() {
    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-[#F2F1ED]">
                <Outlet />
            </main>
        </div>
    );
};

