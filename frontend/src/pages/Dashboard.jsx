// import React, { useEffect, useState } from 'react'
// import useStore from '../store/todoStore'
// import "../index.css"
// import { useAuth } from '../store/auth.store';
// import { Notifications } from '../components/Notifications';

// export const Dashboard = () => {
//   const { todos, fetchTodos, addTodo, editTodo, deleteTodo, markFinished, isLoading, error, fetchTodo, date } = useStore();
//   const [todo, setTodo] = useState("")
//   const [description, setDescription] = useState("")
//   const [editMode, setEditMode] = useState(false)
//   const [editTodoId, setEditTodoId] = useState(null)
//   const [showForm, setShowForm] = useState(false)
//   const { currentUser, loading } = useAuth();
//   const currentUserId = currentUser.uid;
  
//   useEffect(() => { fetchTodos(date) }, [currentUser, date]);

//   const handleChange = (e) => { setTodo(e.target.value) }
//   const handleDescriptionChange = (e) => { setDescription(e.target.value) }

//   const handleSubmit = async () => {
//     if (!editMode) {
//       console.log("add button clicked");
//       await addTodo({ title: todo, description: description, userId: currentUserId });
//     }
//     else {
//       await editTodo({ title: todo, description: description, id: editTodoId, userId: currentUserId });
//       setEditMode(false);
//       setEditTodoId(null);
//     }
//     setTodo("");
//     setDescription("");
//     setShowForm(false);
//   }

//   const handleCancel = () => {
//     setTodo("");
//     setDescription("");
//     setShowForm(false);
//     setEditMode(false);
//     setEditTodoId(null);
//   }

//   const handleDelete = async (id) => {
//     await deleteTodo(id);
//   }

//   const handleEdit = async (todo) => {
//     setTodo(todo.title);
//     setDescription(todo.description || "");
//     setEditMode(true);
//     setEditTodoId(todo.id);
//     setShowForm(true);
//   }

//   const handleFinish = async (id) => {
//     console.log("finish button clicked");
//     await markFinished(id);
//   }

//   const openAddForm = () => {
//     setShowForm(true);
//     setEditMode(false);
//     setTodo("");
//     setDescription("");
//   }

//   return (
//     <>
//       {!loading &&
//         <div className='mr-10 ml-10 w-full pt-4 relative'>
//           <div className="flex items-center justify-around">
//             <div className="mr-[700px]">
//               <h2 className='text-2xl font-bold'>Hello {currentUser.displayName} !</h2>
//               <span className='text-xs'>here is whats up today</span>
//             </div>
//             <Notifications />
//           </div>
          
//           <div className='p-3 w-3/5 mt-5 mb-5 bg-white rounded-xl flex flex-col shadow-md'>
//             {/* Header with Your Tasks and + Button aligned */}
//             <div className='flex justify-between items-center m-4'>
//               <div className='h-16 text-black text-2xl font-bold flex items-center'>
//                 Your Tasks
//               </div>
//               <button
//                 type="button"
//                 className='bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105'
//                 onClick={openAddForm}
//               >
//                 <span className="material-symbols-outlined text-2xl">add</span>
//               </button>
//             </div>
            
//             {/* Border line */}
//             <div className='w-full border-b-2 border-b-[#E6E9E8] mx-2'></div>
            
//             {todos.map((todoItem) => (
//               <div className="h-auto min-h-16 w-full border-b-[#E6E9E8] text-black text-lg border-b-2 flex items-center ml-2 gap-2 relative py-2" key={todoItem.id}>
//                 <div key={todoItem.id} className='bg-pink-200 border-2 border-pink-500 rounded-lg flex justify-center items-center w-9 h-8 flex-shrink-0'>
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
//                   </svg>
//                 </div>
//                 <div className='flex-grow'>
//                   <div className='font-medium'>{todoItem.title}</div>
//                   {todoItem.description && (
//                     <div className='text-sm text-gray-600 mt-1'>{todoItem.description}</div>
//                   )}
//                 </div>
//                 <div className='flex gap-3 items-center justify-end h-full absolute right-3'>
//                   <span className="material-symbols-outlined text-xl text-blue-500 hover:cursor-pointer" onClick={() => handleEdit(todoItem)}>edit</span>
//                   <span className="material-symbols-outlined text-xl text-green-500 hover:cursor-pointer" onClick={() => handleFinish(todoItem.id)}>check_circle</span>
//                   <span className="material-symbols-outlined text-xl text-red-500 hover:cursor-pointer" onClick={() => handleDelete(todoItem.id)}>delete</span>
//                   <div className='text-xs font font-semibold italic bg-blue-500 rounded-md px-1 text-white'>{todoItem.createdAt ? todoItem.createdAt.split("T")[0] : 'No date'}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Popup Form */}
//           {showForm && (
//             <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
//               <div className='bg-white rounded-xl p-6 w-96 shadow-2xl'>
//                 <h3 className='text-xl font-bold mb-4 text-gray-800'>
//                   {editMode ? 'Edit Task' : 'Add New Task'}
//                 </h3>
                
//                 <div className='mb-4'>
//                   <label className='block text-sm font-medium text-gray-700 mb-2'>
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                     value={todo}
//                     onChange={handleChange}
//                     placeholder="Enter task title..."
//                   />
//                 </div>

//                 <div className='mb-6'>
//                   <label className='block text-sm font-medium text-gray-700 mb-2'>
//                     Description
//                   </label>
//                   <textarea
//                     className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
//                     rows="3"
//                     value={description}
//                     onChange={handleDescriptionChange}
//                     placeholder="Enter task description..."
//                   />
//                 </div>

//                 <div className='flex gap-3 justify-end'>
//                   <button
//                     type="button"
//                     className='px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200'
//                     onClick={handleCancel}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50'
//                     onClick={handleSubmit}
//                     disabled={isLoading || !todo.trim()}
//                   >
//                     {editMode ? 'Update' : 'Add'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       }
//     </>
//   )
// }

import React, { useEffect, useState } from 'react'
import useStore from '../store/todoStore'
import "../index.css"
import { useAuth } from '../store/auth.store';
import { Notifications } from '../components/Notifications';

export const Dashboard = () => {
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
    <>
      {!loading &&
        <div className='mr-10 ml-10 w-full pt-4 relative'>
          <div className="flex items-center justify-around">
            <div className="mr-[700px]">
              <h2 className='text-2xl font-bold'>Hello {currentUser.displayName} !</h2>
              <span className='text-xs'>here is whats up today</span>
            </div>
            <Notifications />
          </div>
          
          <div className='p-3 w-3/5 mt-5 mb-5 bg-white rounded-xl flex flex-col shadow-md'>
            {/* Header with Your Tasks and + Button aligned */}
            <div className='flex justify-between items-center m-4'>
              <div className='h-16 text-black text-2xl font-bold flex items-center'>
                Your Tasks
              </div>
              <button
                type="button"
                className='bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105'
                onClick={openAddForm}
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            
            {/* Border line */}
            <div className='w-full border-b-2 border-b-[#E6E9E8] mx-2'></div>
            
            {todos.map((todoItem) => (
              <div 
                className="h-auto min-h-16 w-full border-b-[#E6E9E8] text-black text-lg border-b-2 flex items-center ml-2 gap-2 relative py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-200" 
                key={todoItem.id}
                onClick={() => handleTodoClick(todoItem)}
              >
                <div className='bg-pink-200 border-2 border-pink-500 rounded-lg flex justify-center items-center w-9 h-8 flex-shrink-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                  </svg>
                </div>
                <div className='flex-grow pr-4' style={{ maxWidth: 'calc(100% - 200px)' }}>
                  <div className='font-medium truncate'>{todoItem.title}</div>
                  {todoItem.description && (
                    <div 
                      className='text-sm text-gray-600 mt-1 truncate'
                      style={{ 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {todoItem.description}
                    </div>
                  )}
                </div>
                <div className='flex gap-3 items-center justify-end h-full absolute right-3' onClick={handleActionClick}>
                  <span className="material-symbols-outlined text-xl text-blue-500 hover:cursor-pointer" onClick={() => handleEdit(todoItem)}>edit</span>
                  <span className="material-symbols-outlined text-xl text-green-500 hover:cursor-pointer" onClick={() => handleFinish(todoItem.id)}>check_circle</span>
                  <span className="material-symbols-outlined text-xl text-red-500 hover:cursor-pointer" onClick={() => handleDelete(todoItem.id)}>delete</span>
                  <div className='text-xs font font-semibold italic bg-blue-500 rounded-md px-1 text-white'>{todoItem.createdAt ? todoItem.createdAt.split("T")[0] : 'No date'}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Form Popup */}
          {showForm && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-xl p-6 w-96 shadow-2xl'>
                <h3 className='text-xl font-bold mb-4 text-gray-800'>
                  {editMode ? 'Edit Task' : 'Add New Task'}
                </h3>
                
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title
                  </label>
                  <input
                    type="text"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                    rows="3"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter task description..."
                  />
                </div>

                <div className='flex gap-3 justify-end'>
                  <button
                    type="button"
                    className='px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200'
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50'
                    onClick={handleSubmit}
                    disabled={isLoading || !todo.trim()}
                  >
                    {editMode ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Todo Detail Popup */}
          {showDetailPopup && selectedTodo && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={closeDetailPopup}>
              <div className='bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-xl font-bold text-gray-800 flex-grow mr-4'>
                    Task Details
                  </h3>
                  <button
                    onClick={closeDetailPopup}
                    className='text-gray-500 hover:text-gray-700 text-xl'
                  >
                    ×
                  </button>
                </div>
                
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title
                  </label>
                  <div className='text-lg font-medium text-gray-900 break-words'>
                    {selectedTodo.title}
                  </div>
                </div>

                {selectedTodo.description && (
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description
                    </label>
                    <div className='text-gray-600 whitespace-pre-wrap break-words max-h-40 overflow-y-auto'>
                      {selectedTodo.description}
                    </div>
                  </div>
                )}

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Created
                  </label>
                  <div className='text-sm text-gray-600'>
                    {selectedTodo.createdAt ? selectedTodo.createdAt.split("T")[0] : 'No date'}
                  </div>
                </div>

                <div className='flex gap-3 justify-end'>
                  <button
                    type="button"
                    className='px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200'
                    onClick={closeDetailPopup}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </>
  )
}