import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Main() {
  return (
    <div>
        <Navbar></Navbar>
    <main>
        <Outlet/>
    </main>
    
    </div>
  )
}

export default Main