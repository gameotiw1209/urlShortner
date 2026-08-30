import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabaseClient.js'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill all fields')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 shadow-xl shadow-neutral-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-neutral-300/50">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-1">Welcome back</h2>
        <p className="text-sm text-neutral-500 mb-6">Login to your account</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-medium rounded-lg py-2.5 transition-all duration-200 shadow-md shadow-neutral-300/50 hover:shadow-lg hover:shadow-neutral-300/60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-neutral-500 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-amber-700 hover:text-amber-800 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login