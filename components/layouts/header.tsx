import React from 'react'
import Image from 'next/image'
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

function Header() {
  return (
    <header className="flex justify-between items-center md:px-6 px-4 md:h-24 h-20 fixed top-0 left-0 z-50 w-full mix-blend-exclusion">
      <div className="relative z-10 isolate mix-blend-normal">
        <a href="/home" className="block">
          <Image src="/logo/logo.png" alt="logo" width={56} height={56} className="cursor-pointer md:w-14 md:h-14 w-8 h-8" />
        </a>
      </div>
      <div className="flex items-center space-x-4 relative z-10">
        <a href="/panier">
          <svg className='text-white' width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.89172 1H4.29774L7.49774 15.9414C7.61513 16.4886 7.9196 16.9777 8.35874 17.3246C8.79789 17.6716 9.34424 17.8546 9.90375 17.8421H21.6692C22.2167 17.8412 22.7476 17.6536 23.1742 17.3102C23.6007 16.9668 23.8973 16.4882 24.015 15.9534L26 7.01504H5.58496M10.2526 23.797C10.2526 24.4614 9.71402 25 9.04962 25C8.38522 25 7.84661 24.4614 7.84661 23.797C7.84661 23.1326 8.38522 22.594 9.04962 22.594C9.71402 22.594 10.2526 23.1326 10.2526 23.797ZM23.4857 23.797C23.4857 24.4614 22.9471 25 22.2827 25C21.6183 25 21.0797 24.4614 21.0797 23.797C21.0797 23.1326 21.6183 22.594 22.2827 22.594C22.9471 22.594 23.4857 23.1326 23.4857 23.797Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href="/login">
          <button className="medium-button mt-0 pointer-events-auto">Se connecter</button>
        </a>
      </div>
    </header>
  )
}

export default Header