import React from 'react'
import {BrowserRouter as AppRouter, Route, Routes} from 'react-router-dom'
import Auth from '../components/auth/Auth'
import Agent from '../components/agent/Agent'

const Router = () => {
  return (
    <AppRouter>
        <Routes>
            <Route path="/agent" element={<Agent/>} />
            <Route path="/" element={<Auth/>} />
            <Route path="/profile" element={<div>Profile</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
    </AppRouter>
  )
}

export default Router