import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { urlApi, ShortenRequest, UrlResponse } from '../services/api'
import { Calendar, Link as LinkIcon, X } from 'lucide-react'

interface UrlFormProps {
  onUrlCreated: (url: UrlResponse) => void
  onCancel: () => void
}

interface FormData {
  originalUrl: string
  customAlias: string
  expirationDate: string
}

export default function UrlForm({ onUrlCreated, onCancel }: UrlFormProps) {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const request: ShortenRequest = {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        expirationDate: data.expirationDate || undefined,
      }
      
      const response = await urlApi.shortenUrl(request)
      onUrlCreated(response.data)
      reset()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to shorten URL'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <LinkIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Shorten a new URL</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Original URL *
          </label>
          <input
            {...register('originalUrl', { 
              required: 'URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL starting with http:// or https://'
              }
            })}
            type="url"
            className="input-field"
            placeholder="https://example.com/very-long-url"
          />
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Alias (optional)
            </label>
            <input
              {...register('customAlias', {
                pattern: {
                  value: /^[a-zA-Z0-9]{3,20}$/,
                  message: 'Alias must be 3-20 characters, letters and numbers only'
                }
              })}
              type="text"
              className="input-field"
              placeholder="my-custom-link"
            />
            {errors.customAlias && (
              <p className="mt-1 text-sm text-red-600">{errors.customAlias.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for auto-generated short code
            </p>
          </div>

          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date (optional)
            </label>
            <div className="relative">
              <input
                {...register('expirationDate')}
                type="datetime-local"
                className="input-field pr-10"
                min={new Date().toISOString().slice(0, 16)}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Defaults to 30 days if not specified
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Shortening...
              </div>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}