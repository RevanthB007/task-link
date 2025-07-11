
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../store/auth.store.jsx'
import { useNavigate } from 'react-router-dom'

export const Sidebar = () => {
    const links = ["/dashboard", "/organizations", "/analytics", "/AI"]
    const { currentUser, loading, logout } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check if screen is mobile size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth >= 1024) {
                setIsOpen(false) // Close mobile menu when switching to desktop
            }
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isOpen && !event.target.closest('.sidebar-container')) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isMobile, isOpen])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobile, isOpen])

    const handleLogout = async () => {
        try {
            await logout()
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handleNavClick = () => {
        if (isMobile) {
            setIsOpen(false)
        }
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    // Hamburger Menu Button (only shown on mobile)
    const HamburgerButton = () => (
        <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200"
            aria-label="Toggle menu"
        >
            <div className="flex flex-col justify-center items-center w-6 h-6">
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}></span>
            </div>
        </button>
    )

    return (
        <>
            {/* Hamburger Button */}
            <HamburgerButton />

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`sidebar-container fixed lg:relative top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-50 to-blue-50 shadow-lg border-r border-slate-200 z-40 transition-transform duration-300 ease-in-out flex flex-col ${
                isMobile 
                    ? isOpen 
                        ? 'translate-x-0' 
                        : '-translate-x-full'
                    : 'translate-x-0'
            }`}>
                
                {/* Header Section */}
                <div className="px-6 py-8 border-b border-slate-200 mt-16 lg:mt-0 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Task Manager</h2>
                    <p className="text-sm text-slate-500 mt-1">Navigation Menu</p>
                </div>
                
                {/* Navigation Links */}
                <nav className="flex flex-col px-4 py-6 space-y-2 flex-1 overflow-y-auto">
                    {links.map((link, index) => (
                        <NavLink 
                            to={link} 
                            key={index}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out hover:transform hover:scale-[1.01] ${
                                    isActive 
                                        ? 'bg-blue-500 text-white shadow-md transform scale-[1.02]' 
                                        : 'text-slate-700 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full transition-opacity duration-200 ${
                                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                                    }`}></span>
                                    
                                    {/* Icon for each link */}
                                    <span className="material-symbols-outlined text-xl mr-3">
                                        {link === '/dashboard' ? 'dashboard' : 
                                         link === '/organizations' ? 'business' :
                                         link === '/analytics' ? 'analytics' :
                                         link === '/AI' ? 'psychology' : 'folder'}
                                    </span>
                                    
                                    <span className="capitalize tracking-wide">
                                        {link === '/AI' ? 'AI Assistant' : link.charAt(1).toUpperCase() + link.slice(2)}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
                
                {/* User Profile Section */}
                {!loading && (
                    <div className="p-4 bg-white border-t border-slate-200 shadow-inner flex-shrink-0">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                            {/* Profile Image */}
                            <div className="relative flex-shrink-0">
                                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-slate-300 shadow-sm">
                                    <img
                                        src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName || 'User'}&background=3b82f6&color=fff`}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            
                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {currentUser?.displayName || 'User'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {currentUser?.email}
                                </p>
                            </div>
                            
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group flex-shrink-0"
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
        </>
    )
}

