import React from 'react'
import { useState } from 'react'
import { useSocketStore } from '../store/socket.store'

export const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  
    const { socket, notifications } = useSocketStore();
  
  // Debug logging
  console.log("Socket status:", socket?.connected);
  console.log("Socket ID:", socket?.id);
  console.log("📱 Current notifications:", notifications);
  
  return (
    <div className="relative mr-5">
      {notifications.length == 0 ?
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          notifications
        </span>
        :
        <span className="material-symbols-outlined cursor-pointer" onClick={() => setShowNotifications(!showNotifications) }>
          notifications_unread
        </span>
      }
{
  showNotifications && (
    notifications.length > 0 ?
      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50">
        {notifications.map((notification, idx) => (
          <><p key={idx} className="py-2 px-2 hover:bg-gray-100 rounded text-black">
            {notification}
          </p><span className='material-symbols-outlined cursor-pointer' key={idx}>delete</span></>
        ))}
      </div>
      :
      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50">
        <p className="py-2 px-2 hover:bg-gray-100 rounded text-black">
          No Notifications
        </p>
      </div>
  )
}
    </div >
  )
}