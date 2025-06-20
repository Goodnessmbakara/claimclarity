# 🚀 Deployment Guide for ClaimClarity

## Overview
ClaimClarity consists of two parts:
- **Frontend**: React + Vite (deploy to Vercel)
- **Backend**: Node.js + Express (deploy to Render)

## Backend Deployment (Render)

### Step 1: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Goodnessmbakara/claimclarity`
4. Configure:
   - **Name**: `claimclarity-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: `Free`

### Step 2: Environment Variables
Add these environment variables in Render:
- `OPENAI_API_KEY` = `your_openai_api_key_here`
- `PORT` = `3001`

### Step 3: Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Copy your backend URL (e.g., `https://claimclarity-api.onrender.com`)

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click "New Project"
3. Import repository: `Goodnessmbakara/claimclarity`
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Environment Variables
Add this environment variable in Vercel:
- `VITE_API_URL` = `your_backend_url_from_render`

### Step 3: Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your app will be live at `https://your-project-name.vercel.app`

## Environment Variables Summary

### Backend (Render)
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Testing Deployment
1. Visit your Vercel frontend URL
2. Click "Get Started" on the landing page
3. Try sending a message in the chat
4. Verify the backend is responding correctly

## Troubleshooting
- **CORS Issues**: Backend is configured to allow all origins
- **API Not Responding**: Check Render logs for backend errors
- **Environment Variables**: Ensure they're set correctly in both platforms
- **Build Errors**: Check Vercel build logs for frontend issues

## Cost
- **Vercel**: Free tier includes unlimited deployments
- **Render**: Free tier includes 750 hours/month (sufficient for demo) 