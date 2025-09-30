import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { urlApi, UrlResponse } from '../services/api'
import UrlForm from './UrlForm'
import UrlList from './UrlList'
import Header from './Header'
import LoadingSpinner from './LoadingSpinner'
import { Plus, BarChart3, Link as LinkIcon, Calendar } from 'lucide-react'

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

  // Calculate stats
  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0)
  const activeUrls = urls.filter(url => new Date(url.expiresAt) > new Date()).length
  const expiredUrls = urls.length - activeUrls

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your shortened URLs and track their performance.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center justify-center lg:justify-start"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Short Link
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Links</p>
                <p className="text-2xl font-bold text-gray-900">{urls.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Links</p>
                <p className="text-2xl font-bold text-gray-900">{activeUrls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{expiredUrls}</p>
              </div>
            </div>
          </div>
        </div>

        {/* URL Form */}
        {showForm && (
          <div className="mb-8 animate-slide-up">
            <UrlForm 
              onUrlCreated={handleUrlCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* URL List */}
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