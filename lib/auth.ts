import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { verifyPassword } from '@/lib/password'

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
                captchaToken: { label: 'Captcha Token', type: 'text' }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                // Verify Captcha
                try {
                    const secretKey = process.env.RECAPTCHA_SECRET_KEY
                    const token = credentials.captchaToken as string

                    if (!secretKey || !token) {
                        console.error('Missing Recaptcha keys or token')
                        return null
                    }

                    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `secret=${secretKey}&response=${token}`,
                    })

                    const data = await res.json()

                    if (!data.success || data.score < 0.5) {
                        console.error('Recaptcha verification failed', data)
                        return null
                    }
                } catch (error) {
                    console.error('Recaptcha error', error)
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username as string }
                })

                if (!user?.password) {
                    return null
                }

                const isValid = await verifyPassword(
                    credentials.password as string,
                    user.password
                )

                if (!isValid) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            }
        })
    ],
    pages: {
        signIn: '/',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
            }
            return session
        },
        async signIn({ user, account }) {
            if (account?.provider === 'google' || 'credentials') {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                })

                if (existingUser) {
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            name: user.name,
                            image: user.image
                        }
                    })
                }
            }
            return true
        },
        redirect: async ({ baseUrl }) => {
            return baseUrl
        },
        authorized: async ({ auth }) => {
            return !!auth
        },
    },
})
