// Background service worker for Daraz Price Tracker
// Handles price checking and notifications

const STORAGE_KEY = 'daraz-price-tracker'

// Get products from storage
async function getProducts() {
  const data = await chrome.storage.local.get(STORAGE_KEY)
  const storage = JSON.parse(data[STORAGE_KEY] || '{"products":[]}')
  return storage.products || []
}

// Save products to storage
async function saveProducts(products) {
  const data = await chrome.storage.local.get(STORAGE_KEY)
  const storage = JSON.parse(data[STORAGE_KEY] || '{"products":[]}')
  storage.products = products
  await chrome.storage.local.set({ [STORAGE_KEY]: JSON.stringify(storage) })
}

// Extract price from Daraz page HTML
function extractPriceFromHtml(html) {
  // Method 1: Look for SALE/DISCOUNTED price in JSON data
  const salePricePatterns = [
    /"priceSale"\s*:\s*"?([\d,]+)"?/,
    /"salePrice"\s*:\s*"?([\d,]+)"?/,
    /"offerPrice"\s*:\s*"?([\d,]+)"?/,
    /data-price="([\d,]+)"/
  ]
  
  for (const pattern of salePricePatterns) {
    const match = html.match(pattern)
    if (match) {
      const price = parseInt(match[1].replace(/,/g, ''))
      if (price > 0) return price
    }
  }
  
  // Method 2: Find all prices and return the LOWEST (usually sale price)
  const allPrices = html.match(/Rs\.?\s*([\d,]+)/g)
  if (allPrices && allPrices.length > 0) {
    let lowestPrice = 0
    for (const p of allPrices) {
      const price = parseInt(p.replace(/Rs\.?\s*/g, '').replace(/,/g, ''))
      if (price >= 100 && price <= 1000000) {
        if (lowestPrice === 0 || price < lowestPrice) {
          lowestPrice = price
        }
      }
    }
    if (lowestPrice > 0) return lowestPrice
  }
  
  // Fallback: Handle price range - take the first (lower) price
  const rangeMatch = html.match(/Rs\.?\s*([\d,]+)\s*[-–]\s*Rs\.?\s*([\d,]+)/)
  if (rangeMatch) {
    return parseInt(rangeMatch[1].replace(/,/g, ''))
  }
  
  // Last resort: single price
  const priceMatch = html.match(/Rs\.?\s*([\d,]+)/)
  if (priceMatch) {
    const price = parseInt(priceMatch[1]?.replace(/,/g, '') || '0')
    if (price > 0) return price
  }
  
  return 0
}

// Fetch product price (simplified - in production would need proper scraping)
async function fetchProductPrice(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) return 0
    
    const html = await response.text()
    return extractPriceFromHtml(html)
  } catch (error) {
    console.error('Error fetching price:', error)
    return 0
  }
}

// Show notification for price drop
async function showPriceDropNotification(product, newPrice) {
  const dropAmount = product.currentPrice - newPrice
  const dropPercent = ((dropAmount / product.currentPrice) * 100).toFixed(1)
  
  try {
    await chrome.notifications.create({
      type: 'basic',
      title: 'Price Drop Alert!',
      message: `${product.name}\nWas Rs ${product.currentPrice.toLocaleString()}, Now Rs ${newPrice.toLocaleString()}\nSave ${dropPercent}%!`
    })
  } catch (e) {
    console.log('Notification error:', e)
  }
}

// Check prices for all tracked products
async function checkAllPrices() {
  const products = await getProducts()
  const updatedProducts = []
  
  for (const product of products) {
    const newPrice = await fetchProductPrice(product.url)
    
    if (newPrice > 0 && newPrice !== product.currentPrice) {
      const updatedProduct = {
        ...product,
        currentPrice: newPrice,
        lowestPrice: Math.min(product.lowestPrice, newPrice),
        highestPrice: Math.max(product.highestPrice, newPrice),
        priceHistory: [
          ...product.priceHistory,
          {
            date: new Date().toISOString().split('T')[0],
            price: newPrice
          }
        ],
        lastChecked: Date.now()
      }
      
      // Check if price dropped
      if (newPrice < product.currentPrice) {
        await showPriceDropNotification(product, newPrice)
      }
      
      updatedProducts.push(updatedProduct)
    } else {
      updatedProducts.push({
        ...product,
        lastChecked: Date.now()
      })
    }
  }
  
  await saveProducts(updatedProducts)
  
  await chrome.storage.local.set({
    lastCheckTime: Date.now()
  })
}

// Set up periodic price checking
function setupPriceCheckAlarm() {
  chrome.alarms.create('priceCheck', {
    periodInMinutes: 60
  })
}

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'priceCheck') {
    checkAllPrices()
  }
})

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_PRICES') {
    checkAllPrices().then(() => sendResponse({ success: true }))
    return true
  }
  
  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get('lastCheckTime').then(data => {
      sendResponse({ lastCheckTime: data.lastCheckTime })
    })
    return true
  }
})

// Initialize
setupPriceCheckAlarm()
console.log('Daraz Price Tracker background service started')
