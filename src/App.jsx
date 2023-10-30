import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/app.scss';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Context, server } from './main';

function App() {
   const { setUser, setIsAuthenticated, setLoading } = useContext(Context);

   useEffect(() => {
      setLoading(true);
      axios
         .get(`${server}/users/profile`, {
            withCredentials: true,
         })
         .then((res) => {
            setUser(res.data.user);
            setIsAuthenticated(true);
            setLoading(false);
         })
         .catch((error) => {
            setUser({});
            setIsAuthenticated(false);
            setLoading(false);
         });
   }, []);

   return (
      <Router>
         <Header />
         <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
         </Routes>
         <Toaster />
      </Router>
   );
}

export default App;
