import React, { useState } from 'react'
import { UrlResponse } from '../services/api'
import { formatDate, formatRelativeDate, isExpired, isExpiringSoon } from '../utils/dateUtils'
import { 
  ExternalLink, 
  Copy, 
  Trash2, 
  Calendar, 
  BarChart3, 
  AlertTriangle,
  Clock,
  Globe
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UrlCardProps {
  url: UrlResponse
  onDelete: (shortUrl: string) => void
}

export default function UrlCard({ url, onDelete }: UrlCardProps) {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const expired = isExpired(url.expiresAt)
  const expiringSoon = !expired && isExpiringSoon(url.expiresAt)

  return (
    <div className={`
      bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg
      ${expired ? 'border-red-200 bg-red-50' : expiringSoon ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 hover:border-primary-300'}
    `}>
      <div className="p-6">
        {/* Header with status indicators */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate mr-2">
                {url.fullShortUrl}
              </h3>
              {expired && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expired
                </span>
              )}
              {expiringSoon && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Expires Soon
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="break-all">{url.originalUrl}</span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => copyToClipboard(url.fullShortUrl)}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${copied 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
            
            <a
              href={url.fullShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              title="Open link"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            
            <button
              onClick={() => onDelete(url.shortUrl)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete URL"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats and dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <BarChart3 className="h-4 w-4 mr-2 text-primary-500" />
            <span className="font-medium">{url.clickCount}</span>
            <span className="ml-1">clicks</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-green-500" />
            <div>
              <div className="font-medium">Created</div>
              <div className="text-xs">{formatRelativeDate(url.createdAt)}</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
            <div>
              <div className="font-medium">Expires</div>
              <div className="text-xs">{formatRelativeDate(url.expiresAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}