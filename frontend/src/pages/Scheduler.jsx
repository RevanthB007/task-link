

import React, { useState, useEffect } from 'react';
import { Calendar,Zap, Settings, X, RefreshCw } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import useStore from '../store/todoStore';
import useAIStore from '../store/ai.store';
import { Dashboard } from './Dashboard';

const TaskScheduler = () => {
  const { generateSchedule,getSettings,saveSettings } = useAIStore();
  const {fetchTodos, todos, date, setDate } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [optimizationSummary, setOptimizationSummary] = useState(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  const [globalSettings, setGlobalSettings] = useState({
    preferredTimeSlots: ['Morning (9-12 PM)', 'Afternoon (12-5 PM)'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeBlocksToAvoid: '',
    bufferTime: '15',
    workingHours: { start: '09:00', end: '17:00' },
    breakPreferences: '60',
    productivityHours: [],
    recurringPatterns: '',
    deadlineFlexibility: 'flexible',
    minTimeBlock: '30'
  });

  // Helper function to check if a date is today
  const isToday = (date) => {
    if (!date) return true; // null date means today
    const today = new Date();
    const compareDate = new Date(date);
    return compareDate.toDateString() === today.toDateString();
  };

  // Helper function to format date for display
  const formatDisplayDate = (date) => {
    if (!date || isToday(date)) {
      return 'Today';
    }
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Check if tasks are optimized
  useEffect(() => {
    const hasScheduledTasks = todos.some(task => task.status === 'scheduled' && task.scheduledSlot);
    setIsOptimized(hasScheduledTasks);
  }, [todos]);

  // Initialize date properly on component mount
  useEffect(() => {
    // If date is not null but is today's date, set it to null
    if (date && isToday(date)) {
      setDate(null);
    }
  }, []);

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;
    
    // If selected date is today, set to null; otherwise set to the selected date
    if (selectedDate.toDateString() === new Date().toDateString()) {
      setDate(null);
    } else {
      setDate(selectedDate);
    }
    setShowCalendar(false);
  };

  // Log todos for debugging
  useEffect(() => {
    console.log('Current todos:', todos);
  }, [todos]);

  const timeSlots = ['Early Morning (6-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-8 PM)', 'Late Evening (8-11 PM)'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSettingsChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setGlobalSettings(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setGlobalSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveSettings = async () =>{
    setShowSettings(false)
    await saveSettings(globalSettings);
  }

  const handleArrayChange = (field, value, checked, isGlobal = false) => {
    const setter = setGlobalSettings;
    setter(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const generateOptimizedSchedule = async () => {
    if (todos.length === 0) return;
    
    setIsGeneratingSchedule(true);
    try {
      const result = await generateSchedule(globalSettings, date);
      if (result && result.optimizationSummary) {
        setOptimizationSummary(result.optimizationSummary);
      }
      await fetchTodos();
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  const resetOptimization = async () => {
    setIsGeneratingSchedule(true);
    try {
      // Reset all tasks to pending status
      for (const task of todos) {
        if (task.status === 'scheduled') {
          await editTodo(task.id, { 
            ...task, 
            status: 'pending',
            scheduledSlot: null 
          });
        }
      }
      setOptimizationSummary(null);
      await fetchTodos();
    } catch (error) {
      console.error('Error resetting optimization:', error);
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  const displayTasks = todos || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Task Scheduler</h1>
            <p className="text-gray-600">Create intelligent schedules with AI assistance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {formatDisplayDate(date)}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Calendar className="w-6 h-6" />
              </button>
              
              {showCalendar && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border z-50">
                  <DayPicker
                    mode="single"
                    selected={date ? new Date(date) : new Date()}
                    onSelect={handleDateSelect}
                    className="p-3"
                  />
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Optimization Summary */}
        {optimizationSummary && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-green-900">Schedule Optimized Successfully!</h3>
            </div>
            <div className="text-sm text-green-800 space-y-1">
              <p>• {optimizationSummary.tasksScheduled || displayTasks.filter(t => t.status === 'scheduled').length} tasks scheduled</p>
              <p>• {optimizationSummary.totalDuration || 'Multiple hours'} of work planned</p>
              <p>• Optimized based on priorities and available time slots</p>
            </div>
          </div>
        )}

        {/* Generate Schedule Button */}
        {displayTasks.length > 0 && (
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              {isOptimized && (
                <button
                  onClick={resetOptimization}
                  disabled={isGeneratingSchedule}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reset Schedule
                </button>
              )}
              
              <button
                onClick={generateOptimizedSchedule}
                disabled={isGeneratingSchedule}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingSchedule ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {isOptimized ? 'Re-optimize Schedule' : 'Generate AI Optimized Schedule'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Global Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Scheduling Preferences</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time Slots</label>
                    <div className="grid grid-cols-1 gap-2">
                      {timeSlots.map(slot => (
                        <label key={slot} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={globalSettings.preferredTimeSlots.includes(slot)}
                            onChange={(e) => handleArrayChange('preferredTimeSlots', slot, e.target.checked, true)}
                            className="mr-2"
                          />
                          <span className="text-sm">{slot}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map(day => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={globalSettings.availableDays.includes(day)}
                            onChange={(e) => handleArrayChange('availableDays', day, e.target.checked, true)}
                            className="mr-2"
                          />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={globalSettings.workingHours.start}
                          onChange={(e) => handleSettingsChange('workingHours.start', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={globalSettings.workingHours.end}
                          onChange={(e) => handleSettingsChange('workingHours.end', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Buffer Time (minutes)</label>
                      <input
                        type="number"
                        value={globalSettings.bufferTime}
                        onChange={(e) => handleSettingsChange('bufferTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="pb-6">
                  <h3 className="text-lg font-medium mb-4">Flexibility Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deadline Flexibility</label>
                      <select
                        value={globalSettings.deadlineFlexibility}
                        onChange={(e) => handleSettingsChange('deadlineFlexibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="firm">Firm</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Time Block (minutes)</label>
                      <input
                        type="number"
                        value={globalSettings.minTimeBlock}
                        onChange={(e) => handleSettingsChange('minTimeBlock', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="15"
                        step="15"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Use Dashboard component with "scheduler" page prop */}
      <Dashboard page="scheduler" />
    </div>
  );
};

export default TaskScheduler;