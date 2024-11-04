'use client';

import SignUpForm from '@/components/user/SignUpForm';
import SignInForm from '@/components/user/SignInForm';
import { useState } from 'react';

export default function SignUpPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className='wrapper'>
      <div className=' flex flex-col items-center pt-28 gap-14'>
        <div className='relative flex items-center w-full bg-influenca-light-gray rounded-md p-[2px] max-w-lg mx-auto'>
          <div className={`absolute transition-all duration-200 ease-in-out z-0 top-1/2 transform -translate-y-1/2 ${isSignUp ? 'translate-x-full -ml-[2px]' : 'translate-x-0'} w-1/2 h-[calc(100%-4px)] bg-influenca-black rounded-[4px]`}></div>
          <p
            id='login-btn' 
            className={`z-10 flex-1 text-center flex items-center justify-center text-sm h-8 cursor-pointer rounded-md ${!isSignUp ? 'text-white ' : 'text-influenca-black'}`}
            onClick={() => setIsSignUp(false)}
          >
            Connexion
          </p>
          <p 
            id='signup-btn' 
            className={`z-10 flex-1 text-center flex items-center justify-center text-sm h-8 cursor-pointer rounded-md ${isSignUp ? 'text-white ' : 'text-influenca-black'}`}
            onClick={() => setIsSignUp(true)}
          >
            Inscription
          </p>
        </div>
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <h1>{isSignUp ? 'Inscription' : 'Connexion'}</h1> 
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </div>
      </div>
    </div>
  );
}