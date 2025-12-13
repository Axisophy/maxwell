# MXWLL Pre-Launch System

This system does two things:
1. **Public landing page** at `/` - Captures emails for launch notification
2. **Password protection** - All other pages require authentication

## Quick Setup

### Step 1: Add the files to your project

Copy these files into your existing Maxwell project:

```
maxwell/
├── middleware.ts                          # NEW - Password protection
├── app/
│   ├── page.tsx                           # REPLACE - Pre-launch landing
│   ├── login/
│   │   └── page.tsx                       # NEW - Reviewer login
│   └── api/
│       ├── subscribe/
│       │   └── route.ts                   # NEW - Email capture
│       └── auth/
│           └── login/
│               └── route.ts               # NEW - Login API
└── data/
    └── subscribers.json                   # AUTO-CREATED - Email storage
```

### Step 2: Set up environment variables

Create or update your `.env.local` file:

```bash
# The password you'll share with trusted reviewers
PREVIEW_PASSWORD=maxwell-preview-2025

# Generate this with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
PREVIEW_AUTH_TOKEN=your-generated-token-here
```

**Important:** Also add these to your Vercel environment variables:
1. Go to your Vercel project → Settings → Environment Variables
2. Add both `PREVIEW_PASSWORD` and `PREVIEW_AUTH_TOKEN`
3. Redeploy

### Step 3: Rename your current homepage

Your current homepage at `app/page.tsx` needs to be moved:

```bash
# Move existing homepage to a protected route
mv app/page.tsx app/home/page.tsx
```

Then the new pre-launch page becomes the root.

### Step 4: Deploy

```bash
git add .
git commit -m "Add pre-launch protection"
git push origin main
```

---

## How It Works

### For the public:
- Visit `mxwll.io` → See beautiful landing page
- Enter email → Get added to waitlist
- Try to visit `/observe` → Redirected to login

### For reviewers:
- You share the password with them
- They visit any protected page → Redirected to `/login`
- Enter password → Cookie set for 30 days
- Can now access full site

### For you:
- View subscribers at `/api/subscribe` (GET request)
- Or check `data/subscribers.json` directly

---

## Customization

### Change the landing page copy

Edit `app/page.tsx` (the pre-launch page):
- Headline in the `<h1>` tag
- Description in the first `<p>` tag
- Preview cards at the bottom

### Add Mailchimp/ConvertKit integration

In `app/api/subscribe/route.ts`, uncomment and add:

```typescript
// Mailchimp
async function sendToMailchimp(email: string) {
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
  const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID
  const MAILCHIMP_DC = process.env.MAILCHIMP_DC // e.g., 'us21'
  
  await fetch(
    `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    }
  )
}
```

### Protect additional public routes

Edit `middleware.ts` and add to `PUBLIC_ROUTES`:

```typescript
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/api/subscribe',
  '/about',        // Add more public routes
  '/privacy',
]
```

---

## Sharing with Reviewers

### Option 1: Magic Links (Recommended)

Generate unique access links for specific people. They click once and get instant access.

**Generate a link:**
```bash
curl -X POST "https://mxwll.io/api/admin/tokens?key=YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Sarah - design feedback"}'
```

Response:
```json
{
  "url": "https://mxwll.io/access/xK9mN2pQ7rS1",
  "message": "Share this link with Sarah - design feedback"
}
```

**With expiry (7 days):**
```bash
curl -X POST "https://mxwll.io/api/admin/tokens?key=YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Press preview", "expiresInDays": 7}'
```

**With usage limit (single use):**
```bash
curl -X POST "https://mxwll.io/api/admin/tokens?key=YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "One-time preview", "maxUses": 1}'
```

**List all tokens:**
```bash
curl "https://mxwll.io/api/admin/tokens?key=YOUR_ADMIN_KEY"
```

**Revoke a token:**
```bash
curl -X DELETE "https://mxwll.io/api/admin/tokens?key=YOUR_ADMIN_KEY&token=xK9mN2pQ7rS1"
```

### Option 2: Shared Password

Send them the password directly:

> "I'm working on something called MXWLL - a digital science observatory. Would love your feedback on the dev site.
> 
> Go to: mxwll.io/login
> Password: [your password]
> 
> Please keep this password private for now - we're not public yet."

---

## When You're Ready to Launch

1. Delete `middleware.ts`
2. Replace `app/page.tsx` with your real homepage
3. Delete `app/login/` folder
4. Keep the email list! Export from `data/subscribers.json` or your email service
5. Send launch announcement to everyone on the list

---

## Files Reference

| File | Purpose |
|------|---------|
| `middleware.ts` | Checks auth on every request, redirects if not logged in |
| `app/page.tsx` | Pre-launch landing page with email capture |
| `app/login/page.tsx` | Password entry for reviewers |
| `app/api/subscribe/route.ts` | Handles email signups, stores to JSON |
| `app/api/auth/login/route.ts` | Validates password, sets auth cookie |
| `data/subscribers.json` | Stores email addresses (auto-created) |

---

## Troubleshooting

### "Server configuration error" on login
→ Environment variables not set. Check Vercel dashboard.

### Infinite redirect loop
→ Make sure `PUBLIC_ROUTES` in middleware.ts includes `/` and `/login`

### Subscribers not saving
→ Check the `data/` directory exists and is writable

### Cookie not persisting
→ In production, cookies require HTTPS. Vercel handles this automatically.

---

## Security Notes

- The password is stored as an environment variable (not in code)
- Auth uses httpOnly cookies (can't be accessed by JavaScript)
- Cookie is secure in production (HTTPS only)
- The JSON file shouldn't be committed to git (add `data/` to `.gitignore`)

Add to `.gitignore`:
```
data/subscribers.json
```
