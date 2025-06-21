import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {Dashboard} from './Dashboard.jsx';
import useStore from '../store/todoStore.js';

export const Analytics = () => { 
    const {date,setDate} = useStore();
    const [selectedDate, setSelectedDate] = useState(null)
    const [showCalendar, setshowCalendar ] = useState(false)

    const handleShow = () =>{
      setshowCalendar(!showCalendar)
    }

  return (
    <div className=' p-2 flex w-full'>
    
      <Dashboard />

      <div className='p-4' >
        <button onClick={handleShow}
        className='bg-blue-400 text-black border border-gray-300 rounded px-4 py-2'
        >
          {selectedDate? selectedDate.toDateString(): "Select Date"}
        </button>

        {showCalendar&&(
          <div style={{position:"fixed",right:'1rem',marginTop:'0.5rem',background:'white', border:'1px solid black',borderRadius:'6px',boxShadow:'0 4px 12px rgba(0, 0, 0, 0.1)', zIndex:1}}>
            <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) =>{
              setSelectedDate(date);
              setDate(date);
              console.log(date, "is selected");
            }}
            className='text-black'
            />

          </div>
        )}

      </div>


      
    </div>
  );
};

