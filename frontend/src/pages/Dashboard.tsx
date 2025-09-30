import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { urlApi, UrlResponse } from '../services/api'
import UrlForm from '../components/UrlForm'
import UrlList from '../components/UrlList'
import Header from '../components/Header'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const [urls, setUrls] = useState<UrlResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  const fetchUrls = async () => {
    try {
      const response = await urlApi.getUserUrls()
      setUrls(response.data)
    } catch (error: any) {
      toast.error('Failed to fetch URLs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUrls()
  }, [])

  const handleUrlCreated = (newUrl: UrlResponse) => {
    setUrls(prev => [newUrl, ...prev])
    setShowForm(false)
    toast.success('URL shortened successfully!')
  }

  const handleUrlDeleted = async (shortUrl: string) => {
    try {
      await urlApi.deleteUrl(shortUrl)
      setUrls(prev => prev.filter(url => url.shortUrl !== shortUrl))
      toast.success('URL deleted successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete URL')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username}!
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your shortened URLs and track their performance.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Shorten URL
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 animate-slide-up">
            <UrlForm 
              onUrlCreated={handleUrlCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="animate-fade-in">
          <UrlList 
            urls={urls} 
            onDelete={handleUrlDeleted}
          />
        </div>
      </main>
    </div>
  )
}