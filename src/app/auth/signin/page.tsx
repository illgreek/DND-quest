'use client'

import { Suspense } from 'react'
import SignInForm from '@/app/auth/signin/SignInForm'
import { AuthSkeleton } from '@/components/Skeleton' 

export default function SignIn() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignInForm />
    </Suspense>
  )
} 