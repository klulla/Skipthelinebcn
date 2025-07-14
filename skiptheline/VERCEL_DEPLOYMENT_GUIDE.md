# Vercel Deployment Guide for SkipTheLine Barcelona

This guide will help you deploy your Next.js app to Vercel with Firebase Authentication and environment variable management.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Firebase Project**: Already configured
4. **Stripe Account**: Already configured

## Step 1: Prepare Your Repository

Make sure your code is committed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or leave empty)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: skiptheline-bcn
# - Directory: ./
# - Override settings? No
```

## Step 3: Configure Environment Variables

After deployment, you need to add your environment variables in Vercel:

1. **Go to your project dashboard** in Vercel
2. **Click "Settings"** tab
3. **Click "Environment Variables"**
4. **Add the following variables**:

### Required Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key

# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY=your_google_sheets_private_key
GOOGLE_SHEETS_CLIENT_EMAIL=your_google_sheets_client_email
```

### How to Get These Values

#### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Copy the config values

#### Stripe Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Secret Key**: Developers > API keys > Secret key
3. **Publishable Key**: Developers > API keys > Publishable key
4. **Webhook Secret**: Developers > Webhooks > Select your webhook > Signing secret

#### Resend API Key
1. Go to [Resend Dashboard](https://resend.com)
2. API Keys > Create API Key

#### Google Sheets Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a service account
3. Download the JSON key file
4. Extract the `private_key` and `client_email` values

## Step 4: Set Up Firebase Authentication

### Create Admin User

1. **Go to Firebase Console** > Authentication
2. **Click "Get Started"** if not already set up
3. **Go to "Users" tab**
4. **Click "Add User"**
5. **Enter admin credentials**:
   - Email: `admin@skipthelinebcn.com`
   - Password: `secure_password_here`

### Configure Authentication Methods

1. **In Firebase Console** > Authentication > Sign-in method
2. **Enable "Email/Password"**
3. **Configure any additional methods** if needed

## Step 5: Update Stripe Webhook URL

After deployment, update your Stripe webhook URL:

1. **Go to Stripe Dashboard** > Developers > Webhooks
2. **Edit your webhook endpoint**
3. **Change the URL to**: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
4. **Save the changes**

## Step 6: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Test the main functionality**:
   - Browse events
   - Make a test payment
   - Check admin panel at `/admin`
3. **Test admin authentication**:
   - Go to `/admin`
   - Login with Firebase credentials
   - Create/edit events and clubs

## Step 7: Custom Domain (Optional)

1. **Go to Vercel Dashboard** > Settings > Domains
2. **Add your custom domain**: `skipthelinebcn.com`
3. **Update DNS records** as instructed by Vercel
4. **Update Stripe webhook URL** to use your custom domain

## Troubleshooting

### Common Issues

1. **Build Errors**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript types are correct
   - Check for missing environment variables

2. **Authentication Issues**:
   - Verify Firebase configuration
   - Check that admin user exists in Firebase
   - Ensure Firebase Auth is enabled

3. **Webhook Issues**:
   - Verify webhook URL is correct
   - Check environment variables are set
   - Test with Stripe CLI locally first

4. **Email Not Sending**:
   - Verify Resend API key
   - Check email templates
   - Test with Resend dashboard

### Environment Variable Debugging

Add this to your admin page temporarily to debug:

```typescript
console.log('Environment check:', {
  firebase: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  stripe: !!process.env.STRIPE_SECRET_KEY,
  resend: !!process.env.RESEND_API_KEY,
  sheets: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY
});
```

## Security Best Practices

1. **Never commit `.env.local`** to your repository
2. **Use production Stripe keys** only in Vercel environment variables
3. **Regularly rotate API keys**
4. **Monitor Firebase Auth logs** for suspicious activity
5. **Set up proper Firebase security rules**

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Firebase Analytics**: Already configured
3. **Stripe Dashboard**: Monitor payments and webhooks
4. **Resend Dashboard**: Monitor email delivery

## Next Steps

After successful deployment:

1. **Set up monitoring** and alerts
2. **Configure backup strategies**
3. **Set up CI/CD** for automatic deployments
4. **Implement proper error tracking**
5. **Add performance monitoring**

## Support

If you encounter issues:

1. **Check Vercel deployment logs**
2. **Review Firebase console logs**
3. **Check Stripe webhook delivery logs**
4. **Contact support** with specific error messages

---

**Your app is now deployed and ready for production! 🚀** 