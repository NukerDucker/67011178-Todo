'use server'

import { signIn, signOut } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function handleSignIn(provider?: string) {
  await signIn(provider)
}

export async function loginWithCredentials(formData: FormData) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return 'Invalid credentials'
      }
      return 'Something went wrong'
    }
    throw error
  }
}

export async function handleSignOut() {
  await signOut()
}
