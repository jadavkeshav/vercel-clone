"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  console.log("Navbar rendered with user:", user)
  console.log("Mobile menu open:", isMobileMenuOpen)

  const navItems = [
    { name: "Overview", key: "overview" },
    { name: "Projects", key: "projects" },
    { name: "Integrations", key: "integrations" },
    { name: "Settings", key: "settings" },
  ]

  const handleNavClick = (key: string) => {
    console.log(`Navigation clicked: ${key}`)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    console.log("Logout clicked")
    logout()
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    console.log("Mobile menu toggled")
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="border-b border-gray-800 bg-black mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-white flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-black font-bold select-none">VC</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href="#"
                  onClick={() => handleNavClick(item.key)}
                  className="font-medium text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-white text-sm">{user?.name}</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">
                Sign out
              </button>
            </div>

            <div className="sm:hidden flex items-center space-x-2">
              <span className="text-white text-sm truncate max-w-24">{user?.name}</span>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href="#"
                  onClick={() => handleNavClick(item.key)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  {item.name}
                </a>
              ))}

              <div className="border-t border-gray-800 pt-4 pb-3">
                <div className="px-3 py-2">
                  <div className="text-base font-medium text-white">{user?.name}</div>
                  <div className="text-sm text-gray-400">{user?.email}</div>
                </div>
                <div className="mt-3 px-3">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
