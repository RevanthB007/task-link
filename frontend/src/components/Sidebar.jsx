import { NavLink } from 'react-router-dom'
import { useAuth } from '../store/auth.store.jsx';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
    const links = ["/dashboard", "/organizations", "/analytics","/AI"];
    const { currentUser, loading, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        }
        catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className='h-[640px] w-64 bg-gradient-to-b from-slate-50 to-blue-50 shadow-lg border-r border-slate-200'>
            {/* Header Section */}
            <div className='px-6 py-8 border-b border-slate-200'>
                <h2 className='text-xl font-bold text-slate-800 tracking-tight'>Task Manager</h2>
                <p className='text-sm text-slate-500 mt-1'>Navigation Menu</p>
            </div>
            
            {/* Navigation Links */}
            <nav className='flex flex-col px-4 py-6 space-y-2'>
                {links.map((link, index) => (
                    <NavLink 
                        to={link} 
                        key={index}
                        className={({ isActive }) =>
                            `group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out
                            ${isActive 
                                ? 'bg-blue-500 text-white shadow-md transform scale-[1.02]' 
                                : 'text-slate-700 hover:bg-white hover:text-blue-600 hover:shadow-sm hover:transform hover:scale-[1.01]'
                            }`
                        }
                    >
                        <span className={`absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full transition-opacity duration-200 ${
                            ({ isActive }) => isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        }`}></span>
                        <span className='ml-2 capitalize tracking-wide'>
                            {link.charAt(1).toUpperCase() + link.slice(2)}
                        </span>
                    </NavLink>
                ))}
            </nav>
            
            {/* User Profile Section */}
            {!loading && (
                <div className='fixed w-64 bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-inner'>
                    <div className='flex items-center space-x-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200'>
                        {/* Profile Image */}
                        <div className='relative'>
                            <div className='h-10 w-10 rounded-full overflow-hidden ring-2 ring-slate-300 shadow-sm'>
                                <img
                                    src={currentUser?.photoURL}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
                        </div>
                        
                        {/* User Info */}
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-slate-900 truncate'>
                                {currentUser?.displayName || 'User'}
                            </p>
                            <p className='text-xs text-slate-500 truncate'>
                                {currentUser?.email}
                            </p>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group'
                            title="Logout"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-200">
                                logout
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}