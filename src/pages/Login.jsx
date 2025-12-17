import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../api/authApi'
import { EyeSlashIcon } from '@heroicons/react/24/outline'
import { EyeIcon } from '@heroicons/react/24/outline'
import { ModeToggle } from '@/components/mode-toggle'

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })


  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    if (formData.username && formData.password) {
      try {
        const response = await loginApi(formData.username, formData.password);
        
        // Check if login is successful based on backend response format
        if (response.statusCode === 200 && response.message === "Login Berhasil") {
          // Store authentication state (in real app, use proper auth tokens)
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(response.data));
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          setIsAuthenticated(true);
          navigate('/sistem');
        } else {
          setError(response.message || 'Invalid credentials');
        }
      } catch (error) {
        setError('Login failed: ' + error.message);
      }
    } else {
      setError('Please enter both username and password');
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      
      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Management System</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-foreground font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-foreground font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground  focus:outline-none"
              >
                 {showPassword ? (
                    <EyeIcon className="h-6 w-6" />
                    ) : (
                    <EyeSlashIcon className="h-6 w-6" />
                    )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login