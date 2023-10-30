import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Context, server } from '../main';
import Task from '../components/Task';
import { Navigate } from 'react-router-dom';

const Home = () => {
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [loader, setLoader] = useState(false);
   const [tasks, setTasks] = useState([]);
   const [refresh, setRefresh] = useState(false);
   const { isAuthenticated } = useContext(Context);

   const updateHandler = async (id) => {
      try {
         const { data } = await axios.put(
            `${server}/task/${id}`,
            {},
            { withCredentials: true }
         );
         toast.success(data.message);
         setRefresh((prev) => !prev);
      } catch (error) {
         toast.error(error.response.data.message);
      }
   };

   const deleteHandler = async (id) => {
      try {
         const { data } = await axios.delete(`${server}/task/${id}`, {
            withCredentials: true,
         });
         toast.success(data.message);
         setRefresh((prev) => !prev);
      } catch (error) {
         toast.error(error.response.data.message);
      }
   };

   const submitHandler = async (e) => {
      e.preventDefault();
      try {
         setLoader(true);
         const { data } = await axios.post(
            `${server}/task/new`,
            { title, description },
            {
               withCredentials: true,
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         );
         setTitle('');
         setDescription('');
         toast.success(data.message);
         setLoader(false);
         setRefresh((prev) => !prev);
      } catch (error) {
         toast.error(error.response.data.message);
         setLoader(false);
      }
   };

   useEffect(() => {
      axios
         .get(`${server}/task/alltasks`, { withCredentials: true })
         .then((res) => setTasks(res.data.tasks))
         .catch((e) => toast.error(e.response.data.message));
   }, [refresh]);

   if (!isAuthenticated) return <Navigate to={'/login'} />;

   return (
      <div className='container'>
         <div className='login'>
            <section>
               <form onSubmit={submitHandler}>
                  <input
                     type='text'
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder='Title'
                     required
                  />
                  <input
                     type='text'
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder='Description'
                     required
                  />
                  <button disabled={loader} type='submit'>
                     Add Task
                  </button>
               </form>
            </section>
         </div>

         <section className='todosContainer'>
            {tasks.map((item) => (
               <Task
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  isCompleted={item.isCompleted}
                  updateHandler={updateHandler}
                  deleteHandler={deleteHandler}
                  id={item._id}
               />
            ))}
         </section>
      </div>
   );
};

export default Home;
