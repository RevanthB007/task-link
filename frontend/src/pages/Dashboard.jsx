
import React, { useEffect, useState } from 'react'
import useStore from '../store/todoStore'
import "../index.css"
import { useAuth } from '../store/auth.store';
import { Notifications } from '../components/Notifications';
import { Calendar, Clock, Edit3, Trash2, CheckCircle, Plus, X } from 'lucide-react';

export const Dashboard = ({ page }) => {
  const { todos, fetchTodos, addTodo, editTodo, deleteTodo, markFinished, isLoading, error,  date ,setDate} = useStore();
  const [todo, setTodo] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editTodoId, setEditTodoId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showTimeWheel, setShowTimeWheel] = useState(false)
  const [customHours, setCustomHours] = useState(0)
  const [customMinutes, setCustomMinutes] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [duration, setDuration] = useState("")
  const { currentUser, loading } = useAuth();
  const currentUserId = currentUser.uid;

  if (page !== "analytics" && page !== "scheduler") {
    page = "dashboard"
  }

  useEffect(() => { fetchTodos() }, [currentUser, date]);

  // Check for scheduled tasks
  useEffect(() => {
    const hasScheduledTasks = todos.some(task => task.status === 'scheduled' && task.scheduledSlot);
    setIsOptimized(hasScheduledTasks);
  }, [todos]);

  const handleChange = (e) => { setTodo(e.target.value) }
  const handleDescriptionChange = (e) => { setDescription(e.target.value) }

  const handleSubmit = async () => {
    if (!editMode) {
      await addTodo({ title: todo, description: description, userId: currentUserId, priority, dueDate, dueTime , duration});
    }
    else {
      await editTodo({ title: todo, description: description, id: editTodoId, userId: currentUserId, priority, dueDate, dueTime,
        duration 
       });
      setEditMode(false);
      setEditTodoId(null);
    }
    setTodo("");
    setDescription("");
    setPriority("");
    setDueDate("");
    setDueTime("");
    setShowForm(false);
  }

  const handleCancel = () => {
    setTodo("");
    setDescription("");
    setPriority("");
    setDueDate("");
    setDueTime("");
    setShowForm(false);
    setEditMode(false);
    setEditTodoId(null);
    setShowPriorityDropdown(false);
    setShowTimeWheel(false);
    setShowDatePicker(false);
    setCustomHours(0);
    setCustomMinutes(0);
  }

  const handleDelete = async (id) => {
    await deleteTodo(id);
  }

  const handleEdit = async (todo) => {
    setTodo(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority || "");
    setDueDate(todo.dueDate || "");
    setDueTime(todo.dueTime || "");
    setEditMode(true);
    setEditTodoId(todo.id);
    setShowForm(true);
  }

  const handleFinish = async (id) => {
    await markFinished(id);
  }

  const openAddForm = () => {
    setShowForm(true);
    setEditMode(false);
    setTodo("");
    setDescription("");
    setPriority("");
    setDueDate("");
    setDueTime("");
  }

  const handleActionClick = (e) => {
    e.stopPropagation();
  }

  const handlePrioritySelect = (priorityLevel) => {
    
    setPriority(priorityLevel);
    
    setShowPriorityDropdown(false);
  }

  const handleTimeSelect = (time) => {
    setDueTime(time);
    setShowTimeWheel(false);
  }

  const handleCustomTimeSet = () => {
    const timeString = `${customHours.toString().padStart(2, '0')}:${customMinutes.toString().padStart(2, '0')}`;
    setDueTime(timeString);
    setShowTimeWheel(false);
  }

  const incrementHours = () => {
    setCustomHours((prev) => (prev + 1) % 24);
  }

  const decrementHours = () => {
    setCustomHours((prev) => (prev - 1 + 24) % 24);
  }

  const incrementMinutes = () => {
    setCustomMinutes((prev) => (prev + 1) % 60);
  }

  const decrementMinutes = () => {
    setCustomMinutes((prev) => (prev - 1 + 60) % 60);
  }

  const handleDateSelect = (date) => {
    setDueDate(date);
    setShowDatePicker(false);
  }

  const handleDurationChange = (e) => {
    const duration = e.target.value;
    if (duration === "" || (!isNaN(duration) && parseInt(duration) >= 0))
      setDuration(duration);
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }


  // Filter tasks to show scheduled ones first
  const scheduledTasks = todos.filter(task => task.status === 'scheduled' && task.scheduledSlot);
  const unscheduledTasks = todos.filter(task => task.status !== 'scheduled' || !task.scheduledSlot);
  const displayTasks = [...scheduledTasks, ...unscheduledTasks];

  return (
    <div className='h-full w-full overflow-hidden flex flex-col'>
      {!loading && (
        <div className='flex-1 flex flex-col h-full'>
          {/* Header Section */}
          {/* Header Section */}
          {page === "dashboard" && (
            <div className="flex-shrink-0 px-10 pt-6 pb-4 mb-6 lg:pl-10 pl-20">
              <div className="flex items-center justify-between">
                {/* Welcome Section */}
                <div className="flex-1">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-2xl lg:text-3xl text-gray-900 tracking-tight">
                      Hello, {currentUser.displayName}! 👋
                    </h2>
                    <p className="text-gray-600 text-sm lg:text-base font-medium">
                      Here's what's up today
                    </p>
                  </div>
                </div>

                {/* Notifications */}
                <div className="ml-4">
                  {/* <Notifications /> */}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}


          <div className='flex-1 px-4 sm:px-6 lg:px-10 overflow-y-auto'>
            <div className='max-w-6xl mx-auto'>
              {/* Optimization Summary */}
              {(isOptimized && page === "dashboard") && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center ">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-900">Schedule Active!</h3>
                  </div>
                </div>
              )}

              {/* Tasks List */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    {isOptimized ? 'Scheduled Tasks' : 'Tasks'}
                    {date && (
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        for {new Date(date).toLocaleDateString()}
                      </span>
                    )}
                  </h3>
                  <div className='flex items-center space-x-2'>
                    <span className="text-sm text-gray-500">{todos.length} task{todos.length !== 1 ? 's' : ''}</span>
                    <button
                      onClick={openAddForm}
                      className="bg-blue-600 text-white px-2 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {todos.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No tasks added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add tasks to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayTasks.map((todoItem) => (
                        <div key={todoItem.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h4 className={`font-medium text-gray-900 mr-3 ${todoItem.isCompleted ? 'line-through text-gray-500' : ''}`}>
                                  {todoItem.title}
                                </h4>
                                {todoItem.priority && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todoItem.priority)}`}>
                                    {todoItem.priority}
                                  </span>
                                )}
                                {todoItem.status === 'scheduled' && (
                                  <span className="ml-2 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                    Scheduled
                                  </span>
                                )}
                                {todoItem.isCompleted && (
                                  <span className="ml-2 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                    Completed
                                  </span>
                                )}
                              </div>

                              {/* Scheduled Slot Info */}
                              {todoItem.scheduledSlot && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                  <div className="flex items-center text-sm text-blue-700 mb-1">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span className="font-medium">{new Date(todoItem.scheduledSlot.date).toLocaleDateString('en-CA') || 'To be scheduled'}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span className="font-medium">{todoItem.scheduledSlot.startTime} - {todoItem.scheduledSlot.endTime}</span>
                                  </div>
                                  {todoItem.scheduledSlot.reason && (
                                    <p className="text-xs text-blue-600 mt-1">{todoItem.scheduledSlot.reason}</p>
                                  )}
                                </div>
                              )}

                              {/* Due Date/Time Info (for non-scheduled tasks) */}
                              {!todoItem.scheduledSlot && (todoItem.dueDate || todoItem.dueTime) && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                  <div className="flex items-center text-sm text-blue-700">
                                    {todoItem.dueDate && (
                                      <>
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <span className="font-medium">{new Date(todoItem.dueDate).toLocaleDateString()}</span>
                                      </>
                                    )}
                                    {todoItem.dueTime && (
                                      <>
                                        {todoItem.dueDate && <span className="mx-2">•</span>}
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span className="font-medium">{(todoItem.duration > 60 ? todoItem.duration / 60 + " hours" : todoItem.duration + " minutes")}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="text-sm text-gray-600 space-y-1">
                                {todoItem.description && <p className={todoItem.isCompleted ? 'line-through' : ''}>{todoItem.description}</p>}
                                <div className="flex items-center space-x-4">
                                  <span>
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {todoItem.scheduledSlot?.duration ?
                                      (todoItem.scheduledSlot.duration > 60 ?
                                        todoItem.scheduledSlot.duration / 60 + " hours" :
                                        todoItem.scheduledSlot.duration + " minutes") :
                                      'Duration: To be estimated'
                                    }
                                  </span>
                                  {todoItem.category && <span>• {todoItem.category}</span>}
                                  {!todoItem.scheduledSlot && todoItem.dueDate && <span>• Due: {new Date(todoItem.dueDate).toLocaleDateString()}</span>}
                                  {todoItem.priority && <span>• {todoItem.priority} energy</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4" onClick={handleActionClick}>
                              <button
                                onClick={() => handleEdit(todoItem)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit task"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleFinish(todoItem.id)}
                                className={`p-2 transition-colors ${todoItem.isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                                title={todoItem.isCompleted ? "Task completed" : "Mark as finished"}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(todoItem.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg shadow-2xl'>
                <div className="flex items-center justify-between mb-4">
                  <h3 className='text-lg sm:text-xl font-bold text-gray-800'>
                    {editMode ? 'Edit Task' : 'Add New Task'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Task Title *
                  </label>
                  <input
                    type="text"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base'
                    value={todo}
                    onChange={handleChange}
                    placeholder="Enter task title..."
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base'
                    rows="3"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Brief description of the task..."
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base'
                    value={duration}
                    onChange={handleDurationChange}
                    placeholder="Enter duration in minutes..."
                    min="0"
                  />
                </div>

                {/* Form controls row */}
                <div className='mb-6 flex flex-wrap gap-2'>
                  {/* Priority Button */}
                  <div className='relative'>
                    <button
                      type="button"
                      className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm'
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    >
                      <span className="material-symbols-outlined text-sm text-gray-600">flag</span>
                      <span className='text-gray-700'>
                        {priority || 'Priority'}
                      </span>
                      <span className="material-symbols-outlined text-sm text-gray-600">
                        {showPriorityDropdown ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </button>

                    {showPriorityDropdown && (
                      <div className='absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]'>
                        <div className='py-1'>
                          {['low', 'medium', 'high'].map(level => (
                            <button
                              key={level}
                              className='w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2'
                              onClick={() => handlePrioritySelect(level)}
                            >
                              <div className={`w-3 h-3 rounded-full ${level === 'low' ? 'bg-green-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Due Date Button */}
                  <div className='relative'>
                    <button
                      type="button"
                      className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm'
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <span className="material-symbols-outlined text-sm text-gray-600">calendar_today</span>
                      <span className='text-gray-700'>{formatDate(dueDate)}</span>
                    </button>

                    {showDatePicker && (
                      <div className='absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 p-3'>
                        <input
                          type="date"
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                          value={dueDate}
                          onChange={(e) => handleDateSelect(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    )}
                  </div>

                  {/* Due Time Button */}
                  <div className='relative'>
                    <button
                      type="button"
                      className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm'
                      onClick={() => setShowTimeWheel(!showTimeWheel)}
                    >
                      <span className="material-symbols-outlined text-sm text-gray-600">schedule</span>
                      <span className='text-gray-700'>
                        {dueTime || 'Due time'}
                      </span>
                    </button>

                    {showTimeWheel && (
                      <div className='absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 p-3 min-w-[250px]'>
                        <div className='text-center mb-2'>
                          <h4 className='text-sm font-medium text-gray-700'>Set Time</h4>
                        </div>

                        <div className='flex items-center justify-center gap-2 mb-3'>
                          {/* Hours Section */}
                          <div className='flex flex-col items-center'>
                            <button
                              type="button"
                              className='p-0.5 hover:bg-gray-100 rounded transition-colors'
                              onClick={incrementHours}
                            >
                              <span className="material-symbols-outlined text-sm text-gray-600">keyboard_arrow_up</span>
                            </button>
                            <input
                              type="number"
                              className='text-center w-16 px-2 py-1 border border-gray-300 rounded font-mono text-lg'
                              value={customHours}
                              onChange={(e) => {
                                const value = Math.max(0, Math.min(23, parseInt(e.target.value) || 0));
                                setCustomHours(value);
                              }}
                              min="0"
                              max="23"
                            />
                            <button
                              type="button"
                              className='p-0.5 hover:bg-gray-100 rounded transition-colors'
                              onClick={decrementHours}
                            >
                              <span className="material-symbols-outlined text-sm text-gray-600">keyboard_arrow_down</span>
                            </button>
                            <span className='text-xs text-gray-500 mt-1'>H</span>
                          </div>

                          {/* Colon Separator */}
                          <div className='text-lg font-mono text-gray-600 pb-4'>:</div>

                          {/* Minutes Section */}
                          <div className='flex flex-col items-center'>
                            <button
                              type="button"
                              className='p-0.5 hover:bg-gray-100 rounded transition-colors'
                              onClick={incrementMinutes}
                            >
                              <span className="material-symbols-outlined text-sm text-gray-600">keyboard_arrow_up</span>
                            </button>
                            <input
                              type="number"
                              className='text-center w-16 px-2 py-1 border border-gray-300 rounded font-mono text-lg'
                              value={customMinutes}
                              onChange={(e) => {
                                const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                                setCustomMinutes(value);
                              }}
                              min="0"
                              max="59"
                            />
                            <button
                              type="button"
                              className='p-0.5 hover:bg-gray-100 rounded transition-colors'
                              onClick={decrementMinutes}
                            >
                              <span className="material-symbols-outlined text-sm text-gray-600">keyboard_arrow_down</span>
                            </button>
                            <span className='text-xs text-gray-500 mt-1'>M</span>
                          </div>
                        </div>

                        <div className='flex gap-2 justify-end'>
                          <button
                            type="button"
                            className='px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors'
                            onClick={() => setShowTimeWheel(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                            onClick={handleCustomTimeSet}
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 justify-end'>
                  <button
                    type="button"
                    className='px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base'
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base'
                    onClick={handleSubmit}
                    disabled={isLoading || !todo.trim()}
                  >
                    {editMode ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

