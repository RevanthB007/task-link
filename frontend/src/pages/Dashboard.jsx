import React, { useEffect, useState } from 'react'
import useStore from '../store/todoStore'
import "../index.css"
import { useAuth } from '../store/auth.store';
import { Notifications } from '../components/Notifications';

export const Dashboard = () => {
  const { todos, fetchTodos, addTodo, editTodo, deleteTodo, markFinished, isLoading, error, fetchTodo,date } = useStore();
  const [todo, setTodo] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editTodoId, setEditTodoId] = useState(null)
  const {currentUser ,loading}= useAuth();
  const currentUserId = currentUser.uid;
  useEffect(() => { fetchTodos(date) }, [currentUser])

  const handleChange = (e) => { setTodo(e.target.value) }

  const handleSubmit = async () => {
    if (!editMode) {
      console.log("add button clicked");
      await addTodo({ title: todo ,userId:currentUserId});
    }
    else {
      await editTodo({ title: todo, id: editTodoId ,userId:currentUserId});
      setEditMode(false);
      setEditTodoId(null);
    }
    setTodo("");
  }

  const handleDelete = async (id) => {
    await deleteTodo(id);
  }

  const handleEdit = async (todo) => {
    setTodo(todo.title);
    setEditMode(true);
    setEditTodoId(todo.id);
  }

  const handleFinish = async (id) => {
    console.log("finish button clicked");
    await markFinished(id);
  }

  return (
    <>
  {!loading &&

    <div className='mr-10 ml-10 w-full pt-4 '>

      <div className="flex items-center justify-around">
      <div className="mr-[750px]">
        <h2 className='text-2xl font-bold'>Hello {currentUser.displayName} !</h2>
        <span className='text-xs'>here is whats up today</span>
      </div>
      <Notifications />
      </div>
      <div className='p-3 w-1/2 mt-5 mb-5 bg-white rounded-xl flex flex-col shadow-md'>
        <div className='flex flex-row gap-2 m-4'>
          <input
            type="text"
            className='input'
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            type="button"
            className='bg-black button'
            onClick={handleSubmit}
          >
            <span className="material-symbols-outlined text-xl" >
              add
            </span>
          </button>
        </div>
        <div className=' h-16 w-full border-b-[#E6E9E8] text-black text-2xl font-bold ml-2'>
          Your Tasks
        </div>
        {
          todos.map((todoItem) => (
            <div className="h-16 w-full border-b-[#E6E9E8] text-black text-lg border-b-2 flex items-center ml-2 gap-2" key={todoItem.id}>
              <div key={todoItem.id} className='bg-pink-200 border-2 border-pink-500 rounded-lg flex justify-center items-center w-9 h-8'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
              </div>
              <div>{todoItem.title}</div>
              {
                !editMode ?
                  <span className="material-symbols-outlined text-xl text-blue-500 hover:cursor-pointer" onClick={() => handleEdit(todoItem)}>edit</span>
                  :
                  <span className="material-symbols-outlined text-xl text-blue-500 hover:cursor-pointer" onClick={() => { setEditMode(false); setTodo("") }}>
                    cancel
                  </span>
              }
              <span className="material-symbols-outlined text-xl text-green-500 hover:cursor-pointer" onClick={() => handleFinish(todoItem.id)}>check_circle</span>
              <span className="material-symbols-outlined text-xl text-red-500 hover:cursor-pointer" onClick={() => handleDelete(todoItem.id)}>delete</span>
            </div>
          ))
        }
      </div>
    </div>
  
}
</>
  )
}
