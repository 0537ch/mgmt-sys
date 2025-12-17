import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "@/components/Theme-provider"
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'
import EndpointGroup from './pages/EndpointGroup'
import SystemManagement from './pages/Sistem'
import Settings from './pages/Settings'
import AccGroup from './pages/AccGroup'
import UserAccount from './pages/UserAccount'
import Endpoint from './pages/Endpoint'
import Fitur from './pages/Fitur'


function App() {
  // Initialize state from localStorage to prevent reset on refresh
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    const authData = {
      isAuthenticated: localStorage.getItem('isAuthenticated'),
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    };
    
    if (!authData.token) {
      setIsAuthenticated(false)
    } else if (authData.isAuthenticated === 'true') {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    
    // Listen for storage changes to update authentication state
    const handleStorageChange = () => {
      // Read all auth data in one go to prevent race conditions
      const authData = {
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      };
      
      // If auth was cleared by 401 interceptor, update state and redirect
      if (!authData.token) {
        setIsAuthenticated(false)
      } else if (authData.isAuthenticated === 'true') {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <div className="App h-screen overflow-hidden">
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/menu"
            element={
              isAuthenticated ? (
                <Layout>
                  <EndpointGroup />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/menu-data"
            element={
              isAuthenticated ? (
                <Layout>
                  <Endpoint />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/sistem"
            element={
              isAuthenticated ? (
                <Layout>
                  <SystemManagement />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <Layout>
                  <Settings />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/account-group"
            element={
              isAuthenticated ? (
                <Layout>
                  <AccGroup />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/account"
            element={
              isAuthenticated ? (
                <Layout>
                  <UserAccount />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/fitur"
            element={
              isAuthenticated ? (
                <Layout>
                  <Fitur />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/sistem" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  )
}

export default App
