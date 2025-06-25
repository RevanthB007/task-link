// import React, { useEffect, useState } from 'react'
// import useStore from '../store/todoStore'
// import "../index.css"
// import { useAuth } from '../store/auth.store';
// import { Notifications } from '../components/Notifications';

// export const Dashboard = () => {
//   const { todos, fetchTodos, addTodo, editTodo, deleteTodo, markFinished, isLoading, error, fetchTodo, date } = useStore();
//   const [todo, setTodo] = useState("")
//   const [editMode, setEditMode] = useState(false)
//   const [editTodoId, setEditTodoId] = useState(null)
//   const { currentUser, loading } = useAuth();
//   const currentUserId = currentUser.uid;
//   useEffect(() => { fetchTodos(date) }, [currentUser, date]);

//   const handleChange = (e) => { setTodo(e.target.value) }

//   const handleSubmit = async () => {
//     if (!editMode) {
//       console.log("add button clicked");
//       await addTodo({ title: todo, userId: currentUserId });
//     }
//     else {
//       await editTodo({ title: todo, id: editTodoId, userId: currentUserId });
//       setEditMode(false);
//       setEditTodoId(null);
//     }
//     setTodo("");
//   }

//   const handleDelete = async (id) => {
//     await deleteTodo(id);
//   }

//   const handleEdit = async (todo) => {
//     setTodo(todo.title);
//     setEditMode(true);
//     setEditTodoId(todo.id);
//   }

//   const handleFinish = async (id) => {
//     console.log("finish button clicked");
//     await markFinished(id);
//   }

//   return (
//     <>
//       {!loading &&

//         <div className='mr-10 ml-10 w-full pt-4 '>

//           <div className="flex items-center justify-around">
//             <div className="mr-[700px]">
//               <h2 className='text-2xl font-bold'>Hello {currentUser.displayName} !</h2>
//               <span className='text-xs'>here is whats up today</span>
//             </div>
//             {/* <span class="material-symbols-outlined">
//               search
//             </span> */}
//             <Notifications />
//           </div>
//           <div className='p-3 w-3/5 mt-5 mb-5 bg-white rounded-xl flex flex-col shadow-md'>
//             <div className='flex flex-row gap-2 m-4'>
//               <input
//                 type="text"
//                 className='input'
//                 value={todo}
//                 onChange={(e) => setTodo(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//               />
//               <button
//                 type="button"
//                 className='bg-black button'
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//               >
//                 <span className="material-symbols-outlined text-xl" >
//                   add
//                 </span>
//               </button>
//             </div>
//             <div className=' h-16 w-full border-b-[#E6E9E8] text-black text-2xl font-bold ml-2'>
//               Your Tasks
//             </div>
//             {
//               todos.map((todoItem) => (
//                 <div className="h-16 w-full border-b-[#E6E9E8] text-black text-lg border-b-2 flex items-center ml-2 gap-2 relative" key={todoItem.id}>
//                   <div key={todoItem.id} className='bg-pink-200 border-2 border-pink-500 rounded-lg flex justify-center items-center w-9 h-8'>
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
//                     </svg>
//                   </div>
//                   <div>{todoItem.title}</div>
//                   <div className='flex  gap-3 items-center justify-end h-full absolute right-3'>
//                   {
//                     !editMode ?
//                       <span className="material-symbols-outlined text-xl text-blue-500 hover:cursor-pointer" onClick={() => handleEdit(todoItem)}>edit</span>
//                       :
//                       <span className="material-symbols-outlined text-xl text-blue-500 hover:cursor-pointer" onClick={() => { setEditMode(false); setTodo("") }}>
//                         cancel
//                       </span>
//                   }
//                   <span className="material-symbols-outlined text-xl text-green-500 hover:cursor-pointer" onClick={() => handleFinish(todoItem.id)}>check_circle</span>
//                   <span className="material-symbols-outlined text-xl text-red-500 hover:cursor-pointer" onClick={() => handleDelete(todoItem.id)}>delete</span>
//                   <div className='text-xs font font-semibold italic bg-blue-500 rounded-md px-1'>{todoItem.createdAt.split("T")[0]}</div>
//                 </div>
//                 </div>
                
//               ))
//             }
//           </div>
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
              <div className="h-auto min-h-16 w-full border-b-[#E6E9E8] text-black text-lg border-b-2 flex items-center ml-2 gap-2 relative py-2" key={todoItem.id}>
                <div key={todoItem.id} className='bg-pink-200 border-2 border-pink-500 rounded-lg flex justify-center items-center w-9 h-8 flex-shrink-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                  </svg>
                </div>
                <div className='flex-grow'>
                  <div className='font-medium'>{todoItem.title}</div>
                  {todoItem.description && (
                    <div className='text-sm text-gray-600 mt-1'>{todoItem.description}</div>
                  )}
                </div>
                <div className='flex gap-3 items-center justify-end h-full absolute right-3'>
                  <span className="material-symbols-outlined text-xl text-blue-500 hover:cursor-pointer" onClick={() => handleEdit(todoItem)}>edit</span>
                  <span className="material-symbols-outlined text-xl text-green-500 hover:cursor-pointer" onClick={() => handleFinish(todoItem.id)}>check_circle</span>
                  <span className="material-symbols-outlined text-xl text-red-500 hover:cursor-pointer" onClick={() => handleDelete(todoItem.id)}>delete</span>
                  <div className='text-xs font font-semibold italic bg-blue-500 rounded-md px-1 text-white'>{todoItem.createdAt ? todoItem.createdAt.split("T")[0] : 'No date'}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Popup Form */}
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
        </div>
      }
    </>
  )
}