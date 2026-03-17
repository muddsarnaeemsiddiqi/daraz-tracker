// Content script for Daraz product pages
// Extracts product info when user clicks "Track This Product"

function extractPrice() {
  // Method 1: Find the SALE/DISCOUNTED price (this is what users want!)
  // Daraz typically marks sale prices with special classes or strikethrough on original
  const salePriceSelectors = [
    '.price-sale', 
    '.price-current', 
    '.sale-price',
    '.offer-price',
    '.discounted-price',
    '[data-selenium="product-price"]',
    '.pdp-price_delivery__price',
    '.price-wrapper .price'
  ]
  
  for (const selector of salePriceSelectors) {
    const el = document.querySelector(selector)
    if (el) {
      // Check if this element or its parent has strikethrough (original price)
      const style = window.getComputedStyle(el)
      const parentStyle = el.parentElement ? window.getComputedStyle(el.parentElement) : null
      
      // If parent has line-through, this is likely original price - skip
      if (parentStyle && parentStyle.textDecorationLine === 'line-through') continue
      
      const text = el.textContent || ''
      // Handle price range: "Rs 1,000 - Rs 5,000" - take lowest price for sale
      const rangeMatch = text.match(/Rs\.?\s*([\d,]+)\s*[-–]\s*Rs\.?\s*([\d,]+)/)
      if (rangeMatch) {
        const price = parseInt(rangeMatch[1].replace(/,/g, ''))
        if (price > 0) return price
      }
      const match = text.match(/Rs\.?\s*([\d,]+)/)
      if (match) {
        const price = parseInt(match[1].replace(/,/g, ''))
        if (price > 0) return price
      }
    }
  }

  // Method 2: Look for elements with ORIGINAL price that have strikethrough
  // The one WITHOUT strikethrough is likely the sale price
  const allPriceElements = document.querySelectorAll('[class*="price"], .pdp-price')
  let salePrice = 0
  let originalPrice = 0
  
  for (const el of allPriceElements) {
    const text = el.textContent || ''
    const style = window.getComputedStyle(el)
    
    // Check for strikethrough (original price)
    const hasStrikeThrough = style.textDecorationLine === 'line-through' || 
                            el.classList.contains('original-price') ||
                            el.classList.contains('price--old')
    
    const rangeMatch = text.match(/Rs\.?\s*([\d,]+)\s*[-–]\s*Rs\.?\s*([\d,]+)/)
    if (rangeMatch) {
      const price = parseInt(rangeMatch[1].replace(/,/g, ''))
      if (hasStrikeThrough) {
        if (originalPrice === 0 || price < originalPrice) originalPrice = price
      } else {
        if (salePrice === 0 || price < salePrice) salePrice = price
      }
      continue
    }
    
    const match = text.match(/Rs\.?\s*([\d,]+)/)
    if (match) {
      const price = parseInt(match[1].replace(/,/g, ''))
      if (price > 0) {
        if (hasStrikeThrough) {
          if (originalPrice === 0 || price < originalPrice) originalPrice = price
        } else {
          if (salePrice === 0 || price < salePrice) salePrice = price
        }
      }
    }
  }
  
  // Return sale price if found, otherwise original price
  if (salePrice > 0) return salePrice
  if (originalPrice > 0) return originalPrice

  // Method 3: Find all prices on page, return the LOWEST (usually sale price)
  const pageText = document.body.innerText
  const prices = pageText.match(/Rs\.?\s*([\d,]+)/g)
  if (prices && prices.length > 0) {
    let lowestPrice = 0
    for (const p of prices) {
      const price = parseInt(p.replace(/Rs\.?\s*/g, '').replace(/,/g, ''))
      if (price >= 100 && price <= 1000000) {
        if (lowestPrice === 0 || price < lowestPrice) {
          lowestPrice = price
        }
      }
    }
    if (lowestPrice > 0) return lowestPrice
  }
  
  return 0
}

function extractProductInfo() {
  const url = window.location.href
  
  // Extract product name
  let name = ''
  const nameSelectors = [
    'h1[data-selenium="product-title"]',
    '.product-title',
    '#pdp-product-title-id',
    'h1[class*="title"]',
    'h1'
  ]
  
  for (const selector of nameSelectors) {
    const el = document.querySelector(selector)
    if (el) {
      name = el.textContent?.trim() || ''
      if (name && name.length > 5) break
    }
  }
  
  if (!name || name.length < 5) {
    // Fallback: get from URL
    const urlParts = url.split('/')
    const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
    name = lastPart.replace(/-/g, ' ').replace(/\.html$/, '')
  }
  
  // Extract image - try to get the main product image
  let image = ''
  
  // Method 1: Try meta tags first (og:image)
  const ogImage = document.querySelector('meta[property="og:image"]')
  if (ogImage) {
    image = ogImage.getAttribute('content') || ''
  }
  
  // Method 2: Look for the main product image in various selectors
  if (!image) {
    const imageSelectors = [
      '.image-gallery-thumbnail-image img',
      '[data-selenium="product-image"] img',
      '.pdp-image img',
      '.pdp-image-main img',
      '.gallery-image img',
      '#pdp-product-image-id img',
      '.main-image img',
      'img[class*="pdp"]'
    ]
    
    for (const selector of imageSelectors) {
      const el = document.querySelector(selector)
      if (el && el.src) {
        image = el.src
        // Handle lazy loading
        if (!image || image.length < 20) {
          image = el.getAttribute('data-zoom-image') || el.getAttribute('data-src') || el.getAttribute('data-lazy') || ''
        }
        // Fix protocol-relative URLs
        if (image && image.startsWith('//')) {
          image = 'https:' + image
        }
        // Skip invalid images
        if (image && image.includes('data:') && !image.includes('http')) continue
        if (image && image.length > 50) break
      }
    }
  }
  
  // Method 3: Get largest image from page
  if (!image || image.length < 50) {
    const allImages = document.querySelectorAll('img')
    let maxSize = 0
    for (const img of allImages) {
      if (img.naturalWidth > maxSize && img.naturalWidth > 200) {
        image = img.src
        maxSize = img.naturalWidth
      }
    }
  }
  
  // Fix protocol-relative URLs
  if (image && image.startsWith('//')) {
    image = 'https:' + image
  }
  
  const price = extractPrice()
  
  if (!name && !price) {
    return null
  }
  
  return {
    url,
    name: name.substring(0, 100),
    image,
    price
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_PRODUCT' || message.type === 'GET_PRODUCT_INFO') {
    // Wait for images to load
    setTimeout(() => {
      const productInfo = extractProductInfo()
      sendResponse(productInfo)
    }, 1500)
    return true
  }
  
  return true
})

// Notify extension that we're on a Daraz page
window.addEventListener('load', () => {
  setTimeout(() => {
    const productInfo = extractProductInfo()
    if (productInfo && productInfo.price > 0) {
      try {
        chrome.runtime.sendMessage({
          type: 'PRODUCT_DETECTED',
          url: window.location.href,
          hasProduct: true
        })
      } catch (e) {
        // Ignore errors
      }
    }
  }, 2000)
})
