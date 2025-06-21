import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../store/auth.store.jsx';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
    const links = ["/dashboard", "/organizations", "/analytics", "/settings"];
    const { currentUser, loading ,logout} = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try{
        await logout();
        navigate("/login");
        }
        catch(error){
            console.log(error);
        }
    }
    return (
        <div className='h-[640px] w-64 bg-[#FAFCFF] text-black'>
            <nav className='flex flex-col h-full pt-32 text-[17px]'>
                {
                    links.map((link, index) => <NavLink to={link} key={index}
                        className={({ isActive }) =>
                            `border-2 p-4 mb-2 w-full text-center pr-4 
                        rounded-2xl hover:bg-blue-100 hover:border-blue-300  hover:text-[103%] hover:font-semibold ${isActive ? 'border-blue-300 bg-blue-100 font-' : 'border-black'
                            }`}

                    >{link.charAt(1).toUpperCase() + link.slice(2)}</NavLink>)
                }
            </nav>
            {!loading &&
                <div className='w-full border-2 border-gray-400 flex flex-row justify-center items-center h-15 gap-2 bg-slate-400'>
                    <div className='h-10 w-10 bg-black rounded-full overflow-hidden'>
                        <img
                            src={currentUser?.photoURL}
                            alt="profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className='text-black'>{currentUser?.email}</span>
                    <span className="material-symbols-outlined cursor-pointer" onClick={handleLogout} >
                        logout
                    </span>
                </div>
            }

        </div >
    )
}
