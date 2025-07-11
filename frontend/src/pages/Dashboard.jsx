import React, { useEffect, useState } from 'react'
import useStore from '../store/todoStore'
import "../index.css"
import { useAuth } from '../store/auth.store';
import { Notifications } from '../components/Notifications';

export const Dashboard = ({page}) => {
  const { todos, fetchTodos, addTodo, editTodo, deleteTodo, markFinished, isLoading, error, fetchTodo, date } = useStore();
  const [todo, setTodo] = useState("")
  const [description, setDescription] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editTodoId, setEditTodoId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetailPopup, setShowDetailPopup] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState(null)
  const { currentUser, loading } = useAuth();
  const currentUserId = currentUser.uid;

  if(page !== "analytics"){
    page = "dashboard"
  }

  useEffect(() => { fetchTodos(date) }, [currentUser, date]);
  const handleChange = (e) => { setTodo(e.target.value) }
  const handleDescriptionChange = (e) => { setDescription(e.target.value) }

  const handleSubmit = async () => {
    if (!editMode) {
      console.log("add button clicked");
      await addTodo({ title: todo, description: description, userId: currentUserId });
    }
    else {
      await editTodo({ title: todo, description: description, id: editTodoId, userId: currentUserId });
      setEditMode(false);
      setEditTodoId(null);
    }
    setTodo("");
    setDescription("");
    setShowForm(false);
  }

  const handleCancel = () => {
    setTodo("");
    setDescription("");
    setShowForm(false);
    setEditMode(false);
    setEditTodoId(null);
  }

  const handleDelete = async (id) => {
    await deleteTodo(id);
  }

  const handleEdit = async (todo) => {
    setTodo(todo.title);
    setDescription(todo.description || "");
    setEditMode(true);
    setEditTodoId(todo.id);
    setShowForm(true);
  }

  const handleFinish = async (id) => {
    console.log("finish button clicked");
    await markFinished(id);
  }

  const openAddForm = () => {
    setShowForm(true);
    setEditMode(false);
    setTodo("");
    setDescription("");
  }

  const handleTodoClick = (todoItem) => {
    setSelectedTodo(todoItem);
    setShowDetailPopup(true);
  }

  const closeDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedTodo(null);
  }

  const handleActionClick = (e) => {
    e.stopPropagation(); // Prevent the todo item click when clicking action buttons
  }

  return (
    <div className='h-full w-full overflow-hidden flex flex-col'>
      {!loading && (
        <div className='flex-1 flex flex-col h-full'>
          {/* Header Section - Responsive */}
          { page === "dashboard" &&
          <div className="flex-shrink-0 px-10 pt-4 pb-2 mb-4 lg:pl-10 pl-20">
            <div className="flex items-center justify-between">
              <div className=' px-4 py-2 rounded-md w-[348px]'>
                <h2 className=' font-medium lg:text-3xl text-2xl'>Hello {currentUser.displayName}!</h2>
                <span className=' font-italic py-2 lg:text-base text-sm'>here is whats up today</span>
              </div>
              <Notifications />
            </div>
          </div>
}

          {/* Main Content Area - Responsive */}
          <div className='flex-1 px-4 sm:px-6 lg:px-10 overflow-y-auto'>
            <div className='max-w-full lg:max-w-4xl bg-white rounded-xl flex flex-col shadow-md overflow-hidden w-full lg:w-[714px]'>
              <div className='flex justify-between items-center p-3 sm:p-4 flex-shrink-0'>
                <div className='text-black text-lg sm:text-xl lg:text-2xl font-bold'>
                  Your Tasks
                </div>
                <button
                  type="button"
                  className='bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105'
                  onClick={openAddForm}
                >
                  <span className="material-symbols-outlined text-xl sm:text-2xl">add</span>
                </button>
              </div>

              {/* Border line */}
              <div className='border-b-2 border-b-[#E6E9E8] mx-3 sm:mx-4 flex-shrink-0'></div>

              {/* Tasks List - Mobile Optimized */}
              <div className='flex-1 overflow-y-auto overflow-x-hidden'>
                {todos.map((todoItem) => (
                  <div
                    className="min-h-16 sm:min-h-20 w-full border-b-[#E6E9E8] text-black text-sm sm:text-base lg:text-lg border-b-2 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 relative py-2 sm:py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    key={todoItem.id}
                    onClick={() => handleTodoClick(todoItem)}
                  >
                    <div className='bg-pink-200 border-2 border-pink-500 rounded-lg flex justify-center items-center w-8 h-7 sm:w-9 sm:h-8 flex-shrink-0'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0 pr-2'>
                      <div className='font-medium truncate'>{todoItem.title}</div>
                      {todoItem.description && (
                        <div className='text-xs sm:text-sm text-gray-600 mt-1 truncate'>
                          {todoItem.description}
                        </div>
                      )}
                    </div>

                    {/* Mobile: Stack actions vertically, Desktop: Horizontal */}
                    <div className='flex flex-col sm:flex-row gap-1 sm:gap-2 items-center flex-shrink-0' onClick={handleActionClick}>
                      {/* Action buttons - Hidden on mobile, shown on hover or larger screens */}
                      <div className='hidden sm:flex gap-2 items-center'>
                        <span className="material-symbols-outlined text-lg lg:text-xl text-blue-500 hover:cursor-pointer hover:scale-110 transition-transform" onClick={() => handleEdit(todoItem)}>edit</span>
                        <span className="material-symbols-outlined text-lg lg:text-xl text-green-500 hover:cursor-pointer hover:scale-110 transition-transform" onClick={() => handleFinish(todoItem.id)}>check_circle</span>
                        <span className="material-symbols-outlined text-lg lg:text-xl text-red-500 hover:cursor-pointer hover:scale-110 transition-transform" onClick={() => handleDelete(todoItem.id)}>delete</span>
                      </div>

                      {/* Mobile action menu button */}
                      <div className='sm:hidden relative group'>
                        <button className='p-1 rounded-full hover:bg-gray-200 transition-colors'>
                          <span className="material-symbols-outlined text-lg text-gray-600">more_vert</span>
                        </button>
                        <div className='absolute right-0 top-8 bg-white border rounded-lg shadow-lg p-2 hidden group-hover:block z-10'>
                          <div className='flex flex-col gap-1'>
                            <button className='flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded text-sm' onClick={() => handleEdit(todoItem)}>
                              <span className="material-symbols-outlined text-sm text-blue-500">edit</span>
                              Edit
                            </button>
                            <button className='flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded text-sm' onClick={() => handleFinish(todoItem.id)}>
                              <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                              Complete
                            </button>
                            <button className='flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded text-sm' onClick={() => handleDelete(todoItem.id)}>
                              <span className="material-symbols-outlined text-sm text-red-500">delete</span>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Date badge */}
                      <div className='text-xs font-semibold italic bg-blue-500 rounded-md px-2 py-1 text-white whitespace-nowrap'>
                        {todoItem.createdAt ? todoItem.createdAt.split("T")[0] : 'No date'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add/Edit Form Popup - Responsive */}
          {showForm && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg shadow-2xl'>
                <h3 className='text-lg sm:text-xl font-bold mb-4 text-gray-800'>
                  {editMode ? 'Edit Task' : 'Add New Task'}
                </h3>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title
                  </label>
                  <input
                    type="text"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base'
                    value={todo}
                    onChange={handleChange}
                    placeholder="Enter task title..."
                  />
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base'
                    rows="3"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter task description..."
                  />
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
                    {editMode ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Todo Detail Popup - Responsive */}
          {showDetailPopup && selectedTodo && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' onClick={closeDetailPopup}>
              <div className='bg-white rounded-xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg sm:text-xl font-bold text-gray-800 flex-grow mr-4'>
                    Task Details
                  </h3>
                  <button
                    onClick={closeDetailPopup}
                    className='text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl leading-none'
                  >
                    ×
                  </button>
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title
                  </label>
                  <div className='text-base sm:text-lg font-medium text-gray-900 break-words'>
                    {selectedTodo.title}
                  </div>
                </div>

                {selectedTodo.description && (
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description
                    </label>
                    <div className='text-sm sm:text-base text-gray-600 whitespace-pre-wrap break-words max-h-40 overflow-y-auto'>
                      {selectedTodo.description}
                    </div>
                  </div>
                )}

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Status
                  </label>
                  <div className='text-sm sm:text-base text-gray-600'>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedTodo.isCompleted
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {selectedTodo.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Created
                  </label>
                  <div className='text-sm text-gray-600'>
                    {selectedTodo.createdAt ? selectedTodo.createdAt.split("T")[0] : 'No date'}
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 justify-end'>
                  <button
                    type="button"
                    className='px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base'
                    onClick={closeDetailPopup}
                  >
                    Close
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