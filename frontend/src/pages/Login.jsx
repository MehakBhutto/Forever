import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Login = () => {

  const [currentState,setCurrentState] = useState('Sign Up');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async(event) => {
    event.preventDefault();
    try{

      const response = await axios.post(backendUrl + `/api/user/${currentState === "Login" ? 'login' : 'register'}`,{name, email, password})
      if(response.data.success){
        toast.success(`Successfully ${currentState === "Login" ? "login" : "register" } user`);
        localStorage.setItem("tokenA", response.data.token)
        setToken(localStorage.getItem("tokenA"));
      }else{
        toast.error(response.data.message)
      }
    }catch(e){
      console.log(e.message);
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token]);

  return (
    <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-19 gap-4 text-gray-800' onSubmit={onSubmitHandler}>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currentState == 'Sign Up' ? <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/> : ''}
      <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
      <input type="password" value={password}  onChange={(e)=> setPassword(e.target.value)} className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot Your Password?</p>
        {
          currentState == 'Sign Up'
          ? <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login Here</p> :
          <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
