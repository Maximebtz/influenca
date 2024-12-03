'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from "next-auth/react"
import { signOut } from 'next-auth/react'

function Header() {
  const { data: session, status } = useSession()
  const [isUserDropdownMenuOpen, setIsUserDropdownMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById('user-dropdown-btn')
      const dropdownMenu = document.getElementById('user-dropdown-menu')
      
      if (!dropdownBtn?.contains(event.target as Node) && 
          !dropdownMenu?.contains(event.target as Node)) {
        setIsUserDropdownMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const toggleUserDropdownMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsUserDropdownMenuOpen(!isUserDropdownMenuOpen)
  }

  return (
    <div className='relative'>
      <header className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between px-4 mix-blend-exclusion md:h-24 md:px-6">
        <div className="relative isolate z-10 mix-blend-normal">
          <a href="/home" className="block">
            <Image src="/logo/logo.png" alt="logo" width={56} height={56} className="size-8 cursor-pointer md:size-14" priority unoptimized/>
          </a>
        </div>
        <div className="relative z-10 flex items-center space-x-4">
          {status === 'loading' ? (
            <div></div>
          ) : session && session.user ? (
            <div className='relative flex items-center gap-4'>
              <a href="/panier">
                <svg className='text-white' width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.89172 1H4.29774L7.49774 15.9414C7.61513 16.4886 7.9196 16.9777 8.35874 17.3246C8.79789 17.6716 9.34424 17.8546 9.90375 17.8421H21.6692C22.2167 17.8412 22.7476 17.6536 23.1742 17.3102C23.6007 16.9668 23.8973 16.4882 24.015 15.9534L26 7.01504H5.58496M10.2526 23.797C10.2526 24.4614 9.71402 25 9.04962 25C8.38522 25 7.84661 24.4614 7.84661 23.797C7.84661 23.1326 8.38522 22.594 9.04962 22.594C9.71402 22.594 10.2526 23.1326 10.2526 23.797ZM23.4857 23.797C23.4857 24.4614 22.9471 25 22.2827 25C21.6183 25 21.0797 24.4614 21.0797 23.797C21.0797 23.1326 21.6183 22.594 22.2827 22.594C22.9471 22.594 23.4857 23.1326 23.4857 23.797Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <div  className='flex items-center gap-2'>
                <span className="text-sm font-normal text-white">
                  {session.user.username}
                </span>
                <div id='user-dropdown-btn' onClick={toggleUserDropdownMenu} className='flex size-10 cursor-pointer items-center justify-center rounded-full bg-white transition-opacity duration-100 hover:opacity-60'>
                  <span className='text-black'>
                    {session.user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
            </div>
          ) : (
            <a href="/login">
              <button className="medium-button pointer-events-auto mt-0">Se connecter</button>
            </a>
          )}
        </div>
      </header>
      <div id='user-dropdown-menu' className={`absolute right-4 top-full z-10 mt-2 size-max translate-y-1/2 rounded-md border border-zinc-200 bg-white px-2 drop-shadow-lg transition-all duration-100 ${isUserDropdownMenuOpen ? 'block' : 'hidden'}`}>
        {session && session.user.role === 'INFLUENCER' && (
          <div>
            <a href="/boutique/products">
              <button className='mt-1 gap-2 text-nowrap bg-transparent p-2 text-black'>
                Boutique
              </button>
              <hr className='w-full border-t bg-influenca-gray opacity-80' />
            </a>
            <a href="/product/create">
              <button className='mt-1 gap-2 text-nowrap bg-transparent p-2 text-black'>
                Ajouter un produit
              </button>
              <hr className='w-full border-t bg-influenca-gray opacity-80' />
            </a>
          </div>
        )}
        <button onClick={() => signOut()} className='mt-0 flex items-center gap-2 text-nowrap bg-transparent p-2 text-black'>
          Se déconnecter <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
        </button>
      </div>
    </div>
  )
}

export default Header