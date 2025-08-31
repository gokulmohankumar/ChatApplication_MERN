import { useState } from 'react'

import './App.css'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import { Route, Routes } from 'react-router-dom'

import React from 'react'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>
    </>
  )
}

export default App
