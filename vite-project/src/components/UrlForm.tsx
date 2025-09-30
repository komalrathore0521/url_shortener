import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { urlApi, ShortenRequest, UrlResponse } from '../services/api'
import { Calendar, Link as LinkIcon, X, Sparkles } from 'lucide-react'
import { validateUrl, validateAlias } from '../utils/validation'
import { getMinDateTime } from '../utils/dateUtils'

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
  const [showAdvanced, setShowAdvanced] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // Validate URL
      if (!validateUrl(data.originalUrl)) {
        toast.error('Please enter a valid URL starting with http:// or https://')
        setLoading(false)
        return
      }

      // Validate alias if provided
      if (data.customAlias) {
        const aliasError = validateAlias(data.customAlias)
        if (aliasError) {
          toast.error(aliasError)
          setLoading(false)
          return
        }
      }

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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center text-white">
          <Sparkles className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">Create Short Link</h2>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors ml-auto"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Original URL *
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('originalUrl', {
                  required: 'URL is required'
                })}
                type="url"
                className="input-field pl-10"
                placeholder="https://example.com/very-long-url"
              />
            </div>
            {errors.originalUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
            )}
          </div>

          {/* Advanced Options Toggle */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <span>Advanced Options</span>
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 animate-slide-up">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Alias
                  </label>
                  <input
                    {...register('customAlias')}
                    type="text"
                    className="input-field"
                    placeholder="my-custom-link"
                  />
                  {errors.customAlias && (
                    <p className="mt-1 text-sm text-red-600">{errors.customAlias.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    3-20 characters, letters and numbers only
                  </p>
                </div>
                <div>
                  <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <div className="relative">
                    <input
                      {...register('expirationDate')}
                      type="datetime-local"
                      className="input-field pr-10"
                      min={getMinDateTime()}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Defaults to 30 days if not specified
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t">
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
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Short Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}