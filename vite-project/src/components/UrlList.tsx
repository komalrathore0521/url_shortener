import React, { useState } from 'react'
import { UrlResponse } from '../services/api'
import UrlCard from './UrlCard'
import DeleteConfirmModal from './DeleteConfirmModal'
import { Search, ListFilter as Filter, Import as SortAsc } from 'lucide-react'

interface UrlListProps {
  urls: UrlResponse[]
  onDelete: (shortUrl: string) => void
}

type SortOption = 'newest' | 'oldest' | 'mostClicks' | 'expiring'
type FilterOption = 'all' | 'active' | 'expired' | 'expiring'

export default function UrlList({ urls, onDelete }: UrlListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [urlToDelete, setUrlToDelete] = useState<UrlResponse | null>(null)

  // Filter URLs based on search term and filter option
  const filteredUrls = urls.filter(url => {
    const matchesSearch = 
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    const now = new Date()
    const expiresAt = new Date(url.expiresAt)
    const isExpired = expiresAt < now
    const isExpiringSoon = !isExpired && expiresAt < new Date(now.getTime() + 24 * 60 * 60 * 1000)

    switch (filterBy) {
      case 'active':
        return !isExpired && !isExpiringSoon
      case 'expired':
        return isExpired
      case 'expiring':
        return isExpiringSoon
      default:
        return true
    }
  })

  // Sort URLs based on selected option
  const sortedUrls = [...filteredUrls].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'mostClicks':
        return b.clickCount - a.clickCount
      case 'expiring':
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
      default:
        return 0
    }
  })

  const handleDeleteClick = (url: UrlResponse) => {
    setUrlToDelete(url)
  }

  const handleDeleteConfirm = () => {
    if (urlToDelete) {
      onDelete(urlToDelete.shortUrl)
      setUrlToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setUrlToDelete(null)
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
        <p className="text-gray-600">Create your first shortened URL to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search URLs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full sm:w-64"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="input-field pl-10 pr-8 appearance-none bg-white"
            >
              <option value="all">All Links</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-field pl-10 pr-8 appearance-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostClicks">Most Clicks</option>
              <option value="expiring">Expiring Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {sortedUrls.length} of {urls.length} links
      </div>

      {/* URL Cards */}
      {sortedUrls.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No URLs match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedUrls.map((url) => (
            <UrlCard
              key={url.id}
              url={url}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {urlToDelete && (
        <DeleteConfirmModal
          url={urlToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  )
}