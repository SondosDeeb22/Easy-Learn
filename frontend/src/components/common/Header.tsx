// =======================================================================
//? Importing
// =======================================================================
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { apiClient } from '../../services/apiClient';

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearUser } from '../../redux/slices/authSlice';


// styling  -----------------

import { COLORS } from '../../styles/colorPalette';

// pictures 
import logoWhite from '../../assets/logoWhite.png';
import user from '../../assets/user.png';

// icons 
import { HomeIcon, ArrowRightOnRectangleIcon, ChevronDownIcon, } from '@heroicons/react/24/outline';


// ==========================================================================
const Header = () => {
    const userState = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // ------------------------------------------------
    // Toggle dropdown state
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    // ==================================================
    // Handle logout
    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout', {});

        } catch (error) {
            console.error('Logout failed:', error);

        } finally {
            dispatch(clearUser());
            navigate('/', { replace: true });
        }
    };

    // ==================================================================
    // ==================================================================

    return (
        <>
            {/* header ================================================================================================================ */}
            <header className="h-20 w-full flex items-center justify-between px-5" style={{ backgroundColor: COLORS.burgundy }}>
                {/* Logo -------------- */}
                <div className="flex items-center space-x-4 ml-5">
                    <img className="h-10 w-10 object-contain" src={logoWhite} alt="Easy Learn Logo" />
                    <p className="text-lg font-semibold text-white tracking-wide">Easy Learn</p>
                </div>

                {/* username, pic and dropdown -------------- */}
                <div className="flex items-center gap-3">
                    <div className="relative">

                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-white transition-colors duration-200"
                            title="User menu"
                        >
                            <p className="text-white text-sm">{userState.userName || 'User'}</p>
                            <img className="h-8 w-8 rounded-full" src={user} alt="User" />
                            <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown  */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setShowDropdown(false);
                                    }}
                                    className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200 ease-in-out text-sm font-medium rounded-md active:bg-gray-200"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
                                    <span className="whitespace-nowrap">{'logout'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

        </>

    )
}

//================================================================================================================================
export default Header;
