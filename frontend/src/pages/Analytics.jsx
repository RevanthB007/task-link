import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Dashboard } from './Dashboard.jsx';
import useStore from '../store/todoStore.js';
import { TodoChart } from '../components/Chart.jsx';

export const Analytics = () => {
    const { date, setDate } = useStore();
    const [selectedDate, setSelectedDate] = useState(date || null);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);
    const { todos } = useStore();
    const completed = todos.filter((todo) => todo.isCompleted).length;
    const incomplete = todos.filter((todo) => !todo.isCompleted).length;
    const completionRate = (completed / todos.length * 100).toFixed(2)

    const productivity = completionRate<60 ? 'low' : (completionRate>60 && completionRate<80) ? 'medium' : 'high'
    const handleShow = () => {
        setShowCalendar(!showCalendar);
    }

    const handleDateSelect = (date) => {
        console.log(date, "is selected");
        setSelectedDate(date);
        setDate(date);
        setShowCalendar(false);
    }

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar]);

    // Sync with store date changes
    useEffect(() => {
        if (date !== selectedDate) {
            setSelectedDate(date);
        }
    }, [date]);
    console.log(date,"date");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
            {/* Header Section */}
            <div className="mb-8 pl-16 lg:pl-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics</h1>
                        <p className="text-slate-600">Track your productivity and task completion metrics</p>
                    </div>

                    {/* Date Selector */}
                    <div className="relative" ref={calendarRef}>
                        <button
                            onClick={handleShow}
                            className="flex items-center gap-2 bg-white hover:bg-blue-50 text-slate-700 border border-slate-300 rounded-lg px-4 py-2.5 font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:border-blue-300"
                        >
                            <span className="material-symbols-outlined text-lg">
                                calendar_today
                            </span>
                            {selectedDate ? selectedDate.toDateString() : "Select Date"}
                            <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${showCalendar ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {showCalendar && (
                            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    className="text-slate-700"
                                    disabled={{ after: new Date() }}
                                    styles={{
                                        day_selected: {
                                            backgroundColor: '#3b82f6',
                                            color: 'white'
                                        },
                                        day_today: {
                                            color: '#3b82f6',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dashboard Section */}
            <div className="mb-8">
                <Dashboard page="analytics"/>
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-slate-800">Task Analytics</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="material-symbols-outlined text-lg">
                            info
                        </span>
                        Visual breakdown of your task metrics
                    </div>
                </div>

                {/* Responsive Charts Container */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Completion Status Chart */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-slate-800">Completion Status</h3>
                        </div>
                        <div className="h-64 md:h-80 flex items-center justify-center">
                            <div className="w-full max-w-sm h-[250px]">
                                <TodoChart type="completed" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-600 text-center">
                                Track your task completion progress
                            </p>
                        </div>
                    </div>

                    {/* Assignment Distribution Chart */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-slate-800">Task Assignment</h3>
                        </div>
                        <div className="h-64 md:h-80 flex items-center justify-center">
                            <div className="w-full max-w-sm h-[250px]">
                                <TodoChart type="assignment" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-600 text-center">
                                Distribution of personal vs outsourced tasks
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Tasks</p>
                                <p className="text-2xl font-bold text-slate-800">{todos.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600">
                                    task_alt
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Completion Rate</p>
                                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600">
                                    trending_up
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Pending Tasks</p>
                                <p className="text-2xl font-bold text-orange-600">{incomplete}</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-600">
                                    pending
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Productivity</p>
                                <p className="text-2xl font-bold text-purple-600">{productivity}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600">
                                    psychology
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};