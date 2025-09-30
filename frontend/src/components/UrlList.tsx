import React, { useState } from 'react'
import { UrlResponse } from '../services/api'
import { format } from 'date-fns'
import { ExternalLink, Copy, Trash2, Calendar, ChartBar as BarChart3, TriangleAlert as AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DeleteConfirmModal from './DeleteConfirmModal'

interface UrlListProps {
  urls: UrlResponse[]
  onDelete: (shortUrl: string) => void
}

export default function UrlList({ urls, onDelete }: UrlListProps) {
  const [deleteModalUrl, setDeleteModalUrl] = useState<UrlResponse | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
  }

  if (urls.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
        <p className="text-gray-600">
          Create your first shortened URL to get started!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your URLs</h2>
          <span className="text-sm text-gray-500">{urls.length} total</span>
        </div>
        
        <div className="space-y-4">
          {urls.map((url) => (
            <div
              key={url.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                isExpired(url.expiresAt) 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {url.fullShortUrl}
                    </h3>
                    {isExpired(url.expiresAt) && (
                      <div className="ml-2 flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">EXPIRED</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 break-all">
                    {url.originalUrl}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Created: {formatDate(url.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Expires: {formatDate(url.expiresAt)}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {url.clickCount} clicks
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => copyToClipboard(url.fullShortUrl)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <a
                    href={url.fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  
                  <button
                    onClick={() => setDeleteModalUrl(url)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete URL"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteModalUrl && (
        <DeleteConfirmModal
          url={deleteModalUrl}
          onConfirm={() => {
            onDelete(deleteModalUrl.shortUrl)
            setDeleteModalUrl(null)
          }}
          onCancel={() => setDeleteModalUrl(null)}
        />
      )}
    </>
  )
}