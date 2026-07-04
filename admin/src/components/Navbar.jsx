import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex justify-between items-center py-2 px-[4%]'>
      <img className="w-[max(15%,80px)]" src={assets.logo} alt="" />
      <button onClick={() => setToken('')} className='prata-regular bg-gray-600 text-white px-5 py-2 sm:px-7 sm:px-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar
