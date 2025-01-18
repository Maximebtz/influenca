'use client';

import SignUpForm from '@/components/user/SignUpForm';
import SignInForm from '@/components/user/SignInForm';
import { useState } from 'react';

export default function SignUpPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className='wrapper'>
      <div className=' flex flex-col items-center gap-14 pt-28'>
        <div className='relative mx-auto flex w-full max-w-lg items-center rounded-md bg-influenca-light-gray p-[2px]'>
          <div className={`absolute top-1/2 z-0 -translate-y-1/2 transition-all duration-200 ease-in-out${isSignUp ? 'ml-[-2px] translate-x-full' : 'translate-x-0'} h-[calc(100%-4px)] w-1/2 rounded-[4px] bg-influenca-black`}></div>
          <p
            data-testid='login-btn' 
            id='login-btn' 
            className={`z-10 flex h-8 flex-1 cursor-pointer items-center justify-center rounded-md text-center text-sm ${!isSignUp ? 'text-white ' : 'text-influenca-black'}`}
            onClick={() => setIsSignUp(false)}
          >
            Connexion
          </p>
          <p 
            data-testid='signup-btn' 
            id='signup-btn' 
            className={`z-10 flex h-8 flex-1 cursor-pointer items-center justify-center rounded-md text-center text-sm ${isSignUp ? 'text-white ' : 'text-influenca-black'}`}
            onClick={() => setIsSignUp(true)}
          >
            Inscription
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <h1>{isSignUp ? 'Inscription' : 'Connexion'}</h1> 
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </div>
      </div>
    </div>
  );
}