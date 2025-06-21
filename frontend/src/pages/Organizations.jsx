import React from 'react'
import { useForm} from 'react-hook-form'
import useStore from '../store/todoStore';

export const Organizations = () => {
  const {assignTask } = useStore();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      receiverId: "",
      todoId: ""
    }

  });
  const onSubmit = (data) => {
    console.log(data)
    assignTask(data.todoId,data.receiverId);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label> Receiver </label>
      <input {...register("receiverId")} />
      <label> Todo </label>
      <input {...register("todoId")} />
      <input type="submit" className='cursor-pointer' />
    </form>
  )
}
