// Cloud-based Premium System
// Uses a simple JSON endpoint to manage allowed emails
// You can host the JSON file on GitHub Pages, Netlify, or any static hosting

const PREMIUM_API_URL = 'https://raw.githubusercontent.com/yourusername/daraz-tracker-premium/main/emails.json'

// Fallback: local allowed emails if cloud fetch fails
const FALLBACK_EMAILS = ['demo@example.com']

// Fetch allowed emails from cloud
async function fetchAllowedEmails() {
  try {
    const response = await fetch(PREMIUM_API_URL)
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    return data.emails || FALLBACK_EMAILS
  } catch (e) {
    console.log('Using fallback emails:', e)
    return FALLBACK_EMAILS
  }
}

// Check if email is premium
async function checkPremiumAccess(email) {
  const allowedEmails = await fetchAllowedEmails()
  return allowedEmails.includes(email.toLowerCase())
}
