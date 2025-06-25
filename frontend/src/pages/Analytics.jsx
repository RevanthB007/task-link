// import React, { useState, useRef, useEffect } from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import {Dashboard} from './Dashboard.jsx';
// import useStore from '../store/todoStore.js';

// export const Analytics = () => { 
//     const {date,setDate} = useStore();
//     const [selectedDate, setSelectedDate] = useState(null)
//     const [showCalendar, setshowCalendar ] = useState(false)

//     const handleShow = () =>{
//       setshowCalendar(!showCalendar)
//     }

//   return (
//     <div className=' p-2 flex w-full'>
    
//       <Dashboard />

//       <div className='p-4' >
//         <button onClick={handleShow}
//         className='bg-blue-400 text-black border border-gray-300 rounded px-4 py-2'
//         >
//           {selectedDate? selectedDate.toDateString(): "Select Date"}
//         </button>

//         {showCalendar&&(
//           <div style={{position:"fixed",right:'1rem',marginTop:'0.5rem',background:'white', border:'1px solid black',borderRadius:'6px',boxShadow:'0 4px 12px rgba(0, 0, 0, 0.1)', zIndex:1}}>
//             <DayPicker
//             mode="single"
//             selected={selectedDate}
//             onSelect={(date) =>{
//               setSelectedDate(date);
//               setDate(date);
//               console.log(date, "is selected");
//             }}
//             className='text-black'
//             />

//           </div>
//         )}

//       </div>


      
//     </div>
//   );
// };

import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {Dashboard} from './Dashboard.jsx';
import useStore from '../store/todoStore.js';

export const Analytics = () => {
    const {date, setDate} = useStore();
    const [selectedDate, setSelectedDate] = useState(date || null); // Initialize with store date
    const [showCalendar, setShowCalendar] = useState(false);

    const handleShow = () => {
        setShowCalendar(!showCalendar);
    }

    const handleDateSelect = (date) => {
        console.log(date, "is selected");
        setSelectedDate(date);
        setDate(date); // Update the store
        setShowCalendar(false); // Close calendar after selection
    }

    // Sync with store date changes
    useEffect(() => {
        if (date !== selectedDate) {
            setSelectedDate(date);
        }
    }, [date]);

    return (
        <div className='p-2 flex w-full'>
            <Dashboard />
            <div className='p-4'>
                <button 
                    onClick={handleShow}
                    className='bg-blue-400 text-black border border-gray-300 rounded px-4 py-2'
                >
                    {selectedDate ? selectedDate.toDateString() : "Select Date"}
                </button>

                {showCalendar && (
                    <div style={{
                        position: "fixed",
                        right: '1rem',
                        marginTop: '0.5rem',
                        background: 'white',
                        border: '1px solid black',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000 // Increased z-index
                    }}>
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            className='text-black'
                            disabled={{after: new Date()}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};