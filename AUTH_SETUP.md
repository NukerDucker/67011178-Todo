# OAuth & Credentials Authentication Setup Guide

## Overview
Your app now supports three authentication methods:
1. **Google OAuth** - Sign in with Google account
2. **Username/Password** - Traditional login with hashed passwords
3. **Registration** - Create new accounts with email and password

## Setup Instructions

### 1. Database Migration
First, generate Prisma client and push schema changes:

```bash
bun run generate
bun run push
```

This will:
- Add `username` and `password` fields to User model
- Create necessary tables

### 2. Install Dependencies
Bcrypt is needed for password hashing:

```bash
bun install
```

### 3. Configure reCAPTCHA (Required)

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site with:
   - Label: Your app name
   - reCAPTCHA type: reCAPTCHA v3
   - Domains: `localhost` (for development)

3. Copy your keys to `.env.local`:
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 4. Existing Configuration
Your `.env.local` already has:
- Database URL
- Google OAuth credentials
- NextAuth secrets

## Features

### User Registration
- Full name, username (max 20 chars), email, password (min 8 chars)
- Password hashing with bcrypt (10 salt rounds)
- Duplicate username/email prevention
- Form validation

### Username/Password Login
- CAPTCHA verification
- Secure password comparison
- Session creation
- Error handling

### Google OAuth Login
- Automatic account linking
- Profile sync (name, profile image)
- No manual password required

## API Endpoints

### Registration
```
POST /api/auth/register
Body: {
  name: string
  username: string (max 20)
  email: string
  password: string (min 8)
}
```

### Credentials Login
```
POST /api/auth/credentials-login
Body: {
  username: string
  password: string
  captchaToken: string
}
```

## File Structure
- `lib/password.ts` - Password hashing utilities
- `lib/auth.ts` - Updated with Credentials provider
- `app/api/auth/register/route.ts` - Registration endpoint
- `app/api/auth/credentials-login/route.ts` - Login endpoint
- `components/Login.tsx` - Login UI with both methods
- `components/Register.tsx` - Registration form
- `prisma/schema.prisma` - Updated User model

## Security Notes
- Passwords are hashed with bcrypt before storage
- CAPTCHA prevents brute force attacks
- Session tokens are stored securely
- Google OAuth uses industry-standard protocols

## Testing
1. Click "Sign up" to register a new account
2. Login with username/password
3. Or login with Google
4. Todos are isolated per user

## Troubleshooting

**"Invalid captcha"**
- Ensure reCAPTCHA keys are correctly set in `.env.local`
- Check that domain is added to reCAPTCHA console

**"Username already exists"**
- Choose a unique username

**"Password must be at least 8 characters"**
- Use a stronger password

**Database connection issues**
- Verify DATABASE_URL in `.env.local`
- Ensure PostgreSQL is running
