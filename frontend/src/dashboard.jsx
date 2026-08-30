import axios from 'axios'
import { supabase } from '../config/supabaseClient'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const API_URL = 'http://localhost:5000'

function Dashboard() {
    const [longURL, setLONGURL] = useState('')
    const [shortLink, setshortLinks] = useState([])
    const [analytics, setAnalytics] = useState({})
    const [loadingId, setLoadingId] = useState(null)


    const navigate = useNavigate()
    useEffect(() => {
        checkSession()
    }, [])

    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            navigate('/login')
            return
        }
        setUser(session.user)
        setLoading(false)
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!longURL) return

        try {
            const response = await axios.post(`${API_URL}/api/shortner`, {
                redirectURL: longURL
            })
            const newLink = { id: response.data.id, url: `${API_URL}/api/${response.data.id}` }
            setshortLinks([newLink, ...shortLink])
            setLONGURL("")
        }
        catch (error) {
            console.log('error:', error)
        }
    }

    const fetchAnalytics = async (id) => {
        setLoadingId(id)
        try {
            const response = await axios.get(`${API_URL}/api/analytics/${id}`)
            setAnalytics((prev) => ({ ...prev, [id]: response.data }))
        } catch (error) {
            console.log('error:', error)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-10">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-xl shadow-neutral-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-neutral-300/50">
                        <h2 className="text-2xl font-semibold text-neutral-900 mb-1">Shorten a link</h2>
                        <p className="text-sm text-neutral-500 mb-6">Paste a long URL to create a short one</p>

                        <form onSubmit={handleCreate} className="flex gap-3">
                            <input
                                value={longURL}
                                onChange={(e) => setLONGURL(e.target.value)}
                                placeholder="place your long url"
                                className="flex-1 bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                            />
                            <button
                                type="submit"
                                className="bg-neutral-900 hover:bg-neutral-800 active:scale-[0.97] text-white font-medium rounded-lg px-5 py-2.5 transition-all duration-200 shadow-md shadow-neutral-300/50 hover:shadow-lg hover:shadow-neutral-300/60"
                            >
                                create
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        {shortLink.length === 0 && (
                            <p className="text-sm text-neutral-400 text-center py-10">
                                No links yet — create one above.
                            </p>
                        )}
                    {shortLink.map((link) => (
    <div
        key={link.id}
        className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-md shadow-neutral-200/40 transition-all duration-200 hover:shadow-lg hover:border-neutral-300"
    >
        <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-amber-700 hover:text-amber-800 font-medium transition-colors break-all">
            {link.url}
        </a>

        <div className="mt-3 flex items-center justify-between">
            <button
                onClick={() => fetchAnalytics(link.id)}
                disabled={loadingId === link.id}
                className="text-sm text-neutral-500 hover:text-neutral-900 active:scale-95 disabled:opacity-50 transition-all duration-150"
            >
                {loadingId === link.id ? 'loading...' : 'view stats'}
            </button>
            {analytics[link.id] && (
                <span className="text-sm font-medium text-neutral-700">
                    {analytics[link.id].TotalClicks} clicks
                </span>
            )}
        </div>
    </div>
))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xl shadow-neutral-200/60 lg:sticky lg:top-10">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">History</h3>

                        {Object.keys(analytics).length === 0 && (
                            <p className="text-sm text-neutral-400">
                                Click "view stats" on a link to see its visit history here.
                            </p>
                        )}

                        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                            {Object.entries(analytics).map(([id, data]) => {
                                const link = shortLink.find((l) => l.id === id)
                                return (
                                    <div key={id} className="border-t border-neutral-100 pt-4 first:border-t-0 first:pt-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">
                                            {link ? link.url : id}
                                        </p>
                                        <p className="text-xs text-amber-700 font-medium mt-1">
                                            {data.TotalClicks} total clicks
                                        </p>
                                        <ul className="mt-2 space-y-1">
                                            {data.Analytics.length === 0 && (
                                                <li className="text-xs text-neutral-400">No visits yet.</li>
                                            )}
                                            {data.Analytics.slice().reverse().map((visit) => (
                                                <li
                                                    key={visit._id}
                                                    className="text-xs text-neutral-500 bg-neutral-50 rounded-md px-2 py-1"
                                                >
                                                    {visit.timeStamps}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard