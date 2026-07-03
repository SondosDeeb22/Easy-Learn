import { Link, useLocation } from 'react-router-dom';
import { UserGroupIcon, Squares2X2Icon, BookOpenIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';



// ==============================================================================
export default function Sidebar() {

    const location = useLocation();

    const menuItems = [
        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: Squares2X2Icon,
        },
        {
            path: '/admin/students',
            label: 'Students',
            icon: UserGroupIcon,
        },
        {
            path: '/admin/courses',
            label: 'Courses',
            icon: BookOpenIcon,
        },
        {
            path: '/admin/offered-courses',
            label: 'Offered Courses',
            icon: CalendarDaysIcon,
        },
    ];

    // ========================================

    return (
        <aside className="w-16 md:w-64 bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300">
            {/* Navigation Menu */}
            <nav className="flex-1 mt-3 p-2 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-burgundy text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-burgundy'
                                }`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-burgundy'}`} />
                            <span className="hidden md:inline whitespace-nowrap">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
