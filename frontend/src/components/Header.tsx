import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link as LinkIcon, LogOut, User } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <LinkIcon className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ShortLink</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}