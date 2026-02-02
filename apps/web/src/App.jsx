import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './contexts/AuthContext'
import { StoreProvider } from './contexts/StoreContext'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Pos from './pages/Pos'
import Reports from './pages/Reports'
import Suppliers from './pages/Suppliers'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from './pages/Login'
import AddProduct from './pages/AddProduct'
import AddSupplier from './pages/AddSupplier'
import EditSupplier from './pages/EditSupplier'
import EditProduct from './pages/EditProduct'
import PendingApproval from './pages/PendingApproval'
import CompleteProfile from './pages/CompleteProfile'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/inventory" element={<RequireAuth><Inventory /></RequireAuth>} />
            <Route path="/inventory/add" element={<RequireAuth><AddProduct /></RequireAuth>} />
            <Route path="/inventory/edit/:id" element={<RequireAuth><EditProduct /></RequireAuth>} />
            <Route path="/pos" element={<RequireAuth><Pos /></RequireAuth>} />
            <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
            <Route path="/suppliers" element={<RequireAuth><Suppliers /></RequireAuth>} />
            <Route path="/suppliers/add" element={<RequireAuth><AddSupplier /></RequireAuth>} />
            <Route path="/suppliers/edit/:id" element={<RequireAuth><EditSupplier /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
          </Routes>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
