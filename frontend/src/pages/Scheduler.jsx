
// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Plus, Edit3, Trash2, CheckCircle, AlertCircle, Star, User, MapPin, Zap, Settings, X, RefreshCw } from 'lucide-react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import { useAuth } from '../store/auth.store';
// import useStore from '../store/todoStore';
// import useAIStore from '../store/ai.store';

// const TaskScheduler = () => {
//   const { generateSchedule } = useAIStore();
//   const { addTodo, editTodo, deleteTodo, fetchTodos, todos, date, setDate } = useStore();
//   const [showForm, setShowForm] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);
//   const [showScheduleSuggestion, setShowScheduleSuggestion] = useState(false);
//   const [suggestedSchedule, setSuggestedSchedule] = useState(null);
//   const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [isOptimized, setIsOptimized] = useState(false);
//   const [optimizationSummary, setOptimizationSummary] = useState(null);
//   const { currentUser, loading } = useAuth();
//   const currentUserId = currentUser?.uid;

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     duration: '',
//     priority: 'medium',
//     deadline: '',
//     category: '',
//     resources: '',
//   });

//   const [globalSettings, setGlobalSettings] = useState({
//     preferredTimeSlots: [],
//     availableDays: [],
//     timeBlocksToAvoid: '',
//     bufferTime: '15',
//     workingHours: { start: '09:00', end: '17:00' },
//     breakPreferences: '60',
//     productivityHours: [],
//     recurringPatterns: '',
//     deadlineFlexibility: 'firm',
//     minTimeBlock: '30'
//   });

//   // Fetch todos on component mount and when currentUser changes
//   useEffect(() => {
//     if (currentUserId) {
//       fetchTodos(date);
//     }
//   }, [currentUserId, date, fetchTodos]);

//   // Check if tasks are optimized
//   useEffect(() => {
//     const hasScheduledTasks = todos.some(task => task.status === 'scheduled' && task.scheduledSlot);
//     setIsOptimized(hasScheduledTasks);
//   }, [todos]);

//   // Handle date selection from calendar
//   const handleDateSelect = (selectedDate) => {
//     setDate(selectedDate);
//     setShowCalendar(false);
//     fetchTodos(selectedDate);
//   };

//   // Log todos for debugging
//   useEffect(() => {
//     console.log('Current todos:', todos);
//   }, [todos]);

//   const priorityLevels = [
//     { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50' },
//     { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
//     { value: 'high', label: 'High', color: 'text-red-600 bg-red-50' }
//   ];

//   const timeSlots = ['Early Morning (6-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-8 PM)', 'Late Evening (8-11 PM)'];
//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const priorities = ['low', 'medium', 'high'];
//   const categories = ['Work', 'Personal', 'Health', 'Learning', 'Social', 'Household', 'Creative'];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSettingsChange = (field, value) => {
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       setGlobalSettings(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setGlobalSettings(prev => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleArrayChange = (field, value, checked, isGlobal = false) => {
//     const setter = isGlobal ? setGlobalSettings : setFormData;
//     setter(prev => ({
//       ...prev,
//       [field]: checked 
//         ? [...prev[field], value]
//         : prev[field].filter(item => item !== value)
//     }));
//   };

//   const addTask = async () => {
//     if (!formData.title.trim()) return;
    
//     if (!editMode) {
//       const newTask = {
//         ...formData,
//         status: 'pending',
//         currentUserId
//       };
//       await addTodo(newTask);
//     } else {
//       const updatedTask = {
//         ...formData,
//         id: currentTask.id,
//         currentUserId
//       };
//       await editTodo(currentTask.id, updatedTask);
//     }
    
//     resetForm();
//     fetchTodos(date);
//   };
//   console.log(date,"date");
//   const generateOptimizedSchedule = async () => {
//     if (todos.length === 0) return;
    
//     setIsGeneratingSchedule(true);
//     try {
//       const result = await generateSchedule( globalSettings, date);
//       if (result && result.optimizationSummary) {
//         setOptimizationSummary(result.optimizationSummary);
//       }
//       await fetchTodos(date);
//     } catch (error) {
//       console.error('Error generating schedule:', error);
//     } finally {
//       setIsGeneratingSchedule(false);
//     }
//   };

//   const resetOptimization = async () => {
//     setIsGeneratingSchedule(true);
//     try {
//       // Reset all tasks to pending status
//       for (const task of todos) {
//         if (task.status === 'scheduled') {
//           await editTodo(task.id, { 
//             ...task, 
//             status: 'pending',
//             scheduledSlot: null 
//           });
//         }
//       }
//       setOptimizationSummary(null);
//       await fetchTodos(date);
//     } catch (error) {
//       console.error('Error resetting optimization:', error);
//     } finally {
//       setIsGeneratingSchedule(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       duration: '',
//       priority: 'medium',
//       deadline: '',
//       category: '',
//       resources: ''
//     });
//     setShowForm(false);
//     setCurrentTask(null);
//     setEditMode(false);
//   };

//   const deleteTask = async (taskId) => {
//     await deleteTodo(taskId);
//     fetchTodos(date);
//   };

//   const editTask = (task) => {
//     setEditMode(true);
//     setCurrentTask(task);
//     setFormData({
//       title: task.title || '',
//       description: task.description || '',
//       duration: task.duration || '',
//       priority: task.priority || 'medium',
//       deadline: task.deadline || '',
//       category: task.category || '',
//       resources: task.resources || ''
//     });
//     setShowForm(true);
//   };

//   const getPriorityColor = (priority) => {
//     const level = priorityLevels.find(p => p.value === priority);
//     return level ? level.color : 'text-gray-600 bg-gray-50';
//   };

//   const displayTasks = todos || [];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Task Scheduler</h1>
//             <p className="text-gray-600">Create intelligent schedules with AI assistance</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-gray-600">
//               {date ? new Date(date).toLocaleDateString('en-US', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               }) : 'Today'}
//             </div>
            
//             <div className="relative">
//               <button
//                 onClick={() => setShowCalendar(!showCalendar)}
//                 className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <Calendar className="w-6 h-6" />
//               </button>
              
//               {showCalendar && (
//                 <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border z-50">
//                   <DayPicker
//                     mode="single"
//                     selected={date ? new Date(date) : new Date()}
//                     onSelect={handleDateSelect}
//                     className="p-3"
//                   />
//                 </div>
//               )}
//             </div>
            
//             <button
//               onClick={() => setShowSettings(true)}
//               className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Settings className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {/* Optimization Summary */}
//         {optimizationSummary && (
//           <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
//             <div className="flex items-center mb-2">
//               <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//               <h3 className="font-medium text-green-900">Schedule Optimized Successfully!</h3>
//             </div>
//             <div className="text-sm text-green-800 space-y-1">
//               <p>• {optimizationSummary.tasksScheduled || displayTasks.filter(t => t.status === 'scheduled').length} tasks scheduled</p>
//               <p>• {optimizationSummary.totalDuration || 'Multiple hours'} of work planned</p>
//               <p>• Optimized based on priorities and available time slots</p>
//             </div>
//           </div>
//         )}

//         {/* Add Task Button and Generate Schedule */}
//         <div className="mb-6 flex items-center justify-between">
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             Add New Task
//           </button>
          
//           {displayTasks.length > 0 && (
//             <div className="flex items-center space-x-3">
//               {isOptimized && (
//                 <button
//                   onClick={resetOptimization}
//                   disabled={isGeneratingSchedule}
//                   className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <RefreshCw className="w-5 h-5 mr-2" />
//                   Reset Schedule
//                 </button>
//               )}
              
//               <button
//                 onClick={generateOptimizedSchedule}
//                 disabled={isGeneratingSchedule}
//                 className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isGeneratingSchedule ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Zap className="w-5 h-5 mr-2" />
//                     {isOptimized ? 'Re-optimize Schedule' : 'Generate AI Optimized Schedule'}
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Task Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
//               <div className="flex items-center justify-between p-6 border-b">
//                 <h2 className="text-xl font-semibold">{editMode ? 'Edit Task' : 'Create New Task'}</h2>
//                 <button
//                   onClick={resetForm}
//                   className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
              
//               <div className="p-6 space-y-6">
//                 <div className="border-b pb-6">
//                   <h3 className="text-lg font-medium mb-4">Basic Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
//                       <input
//                         type="text"
//                         value={formData.title}
//                         onChange={(e) => handleInputChange('title', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Enter task title"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                       <select
//                         value={formData.category}
//                         onChange={(e) => handleInputChange('category', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Select category</option>
//                         {categories.map(cat => (
//                           <option key={cat} value={cat}>{cat}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
//                       <select
//                         value={formData.priority}
//                         onChange={(e) => handleInputChange('priority', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         {priorityLevels.map(level => (
//                           <option key={level.value} value={level.value}>{level.label}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
                  
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                     <textarea
//                       value={formData.description}
//                       onChange={(e) => handleInputChange('description', e.target.value)}
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Brief description of the task"
//                     />
//                   </div>
//                 </div>

//                 <div className="border-b pb-6">
//                   <h3 className="text-lg font-medium mb-4">Time & Settings</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Optional)</label>
//                       <input
//                         type="text"
//                         value={formData.duration}
//                         onChange={(e) => handleInputChange('duration', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="e.g., 2 hours, 30 minutes"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">AI will estimate if not provided</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Optional)</label>
//                       <input
//                         type="date"
//                         value={formData.deadline}
//                         onChange={(e) => handleInputChange('deadline', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level Required</label>
//                       <select
//                         value={formData.priority}
//                         onChange={(e) => handleInputChange('priority', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         {priorities.map(level => (
//                           <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-4 pt-4 border-t">
//                   <button
//                     onClick={resetForm}
//                     className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={addTask}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     {editMode ? 'Update Task' : 'Add Task'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Settings Modal */}
//         {showSettings && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
//               <div className="flex items-center justify-between p-6 border-b">
//                 <h2 className="text-xl font-semibold">Global Settings</h2>
//                 <button
//                   onClick={() => setShowSettings(false)}
//                   className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
              
//               <div className="p-6 space-y-6">
//                 <div className="border-b pb-6">
//                   <h3 className="text-lg font-medium mb-4">Scheduling Preferences</h3>
                  
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time Slots</label>
//                     <div className="grid grid-cols-1 gap-2">
//                       {timeSlots.map(slot => (
//                         <label key={slot} className="flex items-center">
//                           <input
//                             type="checkbox"
//                             checked={globalSettings.preferredTimeSlots.includes(slot)}
//                             onChange={(e) => handleArrayChange('preferredTimeSlots', slot, e.target.checked, true)}
//                             className="mr-2"
//                           />
//                           <span className="text-sm">{slot}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
//                     <div className="grid grid-cols-2 gap-2">
//                       {daysOfWeek.map(day => (
//                         <label key={day} className="flex items-center">
//                           <input
//                             type="checkbox"
//                             checked={globalSettings.availableDays.includes(day)}
//                             onChange={(e) => handleArrayChange('availableDays', day, e.target.checked, true)}
//                             className="mr-2"
//                           />
//                           <span className="text-sm">{day}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="time"
//                           value={globalSettings.workingHours.start}
//                           onChange={(e) => handleSettingsChange('workingHours.start', e.target.value)}
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <span>to</span>
//                         <input
//                           type="time"
//                           value={globalSettings.workingHours.end}
//                           onChange={(e) => handleSettingsChange('workingHours.end', e.target.value)}
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Buffer Time (minutes)</label>
//                       <input
//                         type="number"
//                         value={globalSettings.bufferTime}
//                         onChange={(e) => handleSettingsChange('bufferTime', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pb-6">
//                   <h3 className="text-lg font-medium mb-4">Flexibility Settings</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Deadline Flexibility</label>
//                       <select
//                         value={globalSettings.deadlineFlexibility}
//                         onChange={(e) => handleSettingsChange('deadlineFlexibility', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="firm">Firm</option>
//                         <option value="flexible">Flexible</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Min Time Block (minutes)</label>
//                       <input
//                         type="number"
//                         value={globalSettings.minTimeBlock}
//                         onChange={(e) => handleSettingsChange('minTimeBlock', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         min="15"
//                         step="15"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <button
//                     onClick={() => setShowSettings(false)}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Save Settings
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Tasks List */}
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="px-4 py-3 border-b flex items-center justify-between">
//             <h3 className="font-medium text-gray-900">
//               {displayTasks.some(task => task.status === 'scheduled') ? 'Scheduled Tasks' : 'Tasks'}
//               {date && (
//                 <span className="ml-2 text-sm font-normal text-gray-500">
//                   for {new Date(date).toLocaleDateString()}
//                 </span>
//               )}
//             </h3>
//             <span className="text-sm text-gray-500">{displayTasks.length} task{displayTasks.length !== 1 ? 's' : ''}</span>
//           </div>
          
//           <div className="p-4">
//             {displayTasks.length === 0 ? (
//               <div className="text-center py-8">
//                 <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-500">No tasks added yet</p>
//                 <p className="text-sm text-gray-400 mt-1">Add tasks to get started with AI scheduling</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {displayTasks.map((task) => (
//                   <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center mb-2">
//                           <h4 className="font-medium text-gray-900 mr-3">{task.title}</h4>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
//                             {task.priority}
//                           </span>
//                           {task.status === 'scheduled' && (
//                             <span className="ml-2 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
//                               Scheduled
//                             </span>
//                           )}
//                         </div>
                        
//                         {task.scheduledSlot && (
//                           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
//                             <div className="flex items-center text-sm text-blue-700 mb-1">
//                               <Calendar className="w-4 h-4 mr-1" />
//                               <span className="font-medium">{task.scheduledSlot.date.slice(0, 10)}</span>
//                               <span className="mx-2">•</span>
//                               <Clock className="w-4 h-4 mr-1" />
//                               <span className="font-medium">{task.scheduledSlot.startTime +" - "+ task.scheduledSlot.endTime}</span>
//                             </div>
//                             {task.scheduledSlot.reason && (
//                               <p className="text-xs text-blue-600 mt-1">{task.scheduledSlot.reason}</p>
//                             )}
//                           </div>
//                         )}
                        
//                         <div className="text-sm text-gray-600 space-y-1">
//                           {task.description && <p>{task.description}</p>}
//                           <div className="flex items-center space-x-4">
//                             <span><Clock className="w-4 h-4 inline mr-1" /> {(task.scheduledSlot.duration>60 ? task.scheduledSlot.duration/60 + " hours" : task.scheduledSlot.duration + " minutes") || 'To be estimated'}</span>
//                             {task.category && <span>• {task.category}</span>}
//                             {task.deadline && <span>• Due: {new Date(task.deadline).toLocaleDateString()}</span>}
//                             <span>• {task.priority} energy</span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-2 ml-4">
//                         <button
//                           onClick={() => editTask(task)}
//                           className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
//                         >
//                           <Edit3 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => deleteTask(task.id)}
//                           className="p-2 text-gray-400 hover:text-red-600 transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskScheduler;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit3, Trash2, CheckCircle, AlertCircle, Star, User, MapPin, Zap, Settings, X, RefreshCw } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useAuth } from '../store/auth.store';
import useStore from '../store/todoStore';
import useAIStore from '../store/ai.store';
import { Dashboard } from './Dashboard'; // Import Dashboard component

const TaskScheduler = () => {
  const { generateSchedule } = useAIStore();
  const { addTodo, editTodo, deleteTodo, fetchTodos, todos, date, setDate } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [optimizationSummary, setOptimizationSummary] = useState(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const { currentUser, loading } = useAuth();
  const currentUserId = currentUser?.uid;

  const [globalSettings, setGlobalSettings] = useState({
    preferredTimeSlots: [],
    availableDays: [],
    timeBlocksToAvoid: '',
    bufferTime: '15',
    workingHours: { start: '09:00', end: '17:00' },
    breakPreferences: '60',
    productivityHours: [],
    recurringPatterns: '',
    deadlineFlexibility: 'firm',
    minTimeBlock: '30'
  });

  // Fetch todos on component mount and when currentUser changes
  useEffect(() => {
    if (currentUserId) {
      fetchTodos(date);
    }
  }, [currentUserId, date, fetchTodos]);

  // Check if tasks are optimized
  useEffect(() => {
    const hasScheduledTasks = todos.some(task => task.status === 'scheduled' && task.scheduledSlot);
    setIsOptimized(hasScheduledTasks);
  }, [todos]);

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setShowCalendar(false);
    fetchTodos(selectedDate);
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
      await fetchTodos(date);
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
      await fetchTodos(date);
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
              {date ? new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Today'}
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
                    onClick={() => setShowSettings(false)}
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