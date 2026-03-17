// Popup script - Vanilla JS version
const STORAGE_KEY = 'daraz-price-tracker'

// SVG Icons
const icons = {
  bell: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  crown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  trendingDown: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M22 7-8.5 18.5-4-4-4.5 4.5L2 7"/></svg>`,
  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`
}

// State
let products = []
let isPremium = false
let premiumEmail = ''  // Store the email that has premium
let checkInterval = 24
let showSettings = false
let currentTab = 'products'

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData()
  await verifyPremiumOnLoad()
  render()
  setupEventListeners()
})

// Verify premium on each load - check if Chrome account matches
async function verifyPremiumOnLoad() {
  try {
    const userInfo = await chrome.identity.getProfileUserInfo()
    const currentEmail = userInfo.email?.toLowerCase() || ''
    
    if (isPremium && premiumEmail && currentEmail !== premiumEmail) {
      // Email changed - revoke premium
      isPremium = false
      premiumEmail = ''
      await saveData()
      console.log('Premium revoked - email changed')
    }
  } catch (e) {
    console.log('Could not verify premium:', e)
  }
}

async function loadData() {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEY)
    if (data[STORAGE_KEY]) {
      const parsed = JSON.parse(data[STORAGE_KEY])
      products = parsed.products || []
      isPremium = parsed.isPremium || false
      premiumEmail = parsed.premiumEmail || ''
      checkInterval = parsed.checkInterval || 24
    }
  } catch (e) {
    console.error('Error loading data:', e)
  }
}

async function saveData() {
  await chrome.storage.local.set({
    [STORAGE_KEY]: JSON.stringify({ products, isPremium, premiumEmail, checkInterval })
  })
}

function formatPrice(price) {
  return `Rs ${price.toLocaleString('en-PK')}`
}

function canAddProduct() {
  if (isPremium) return true
  return products.length < 10
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

async function addProduct(product) {
  if (!canAddProduct()) return
  
  // Check for duplicate URL
  const isDuplicate = products.some(p => p.url === product.url)
  if (isDuplicate) {
    alert('This product is already being tracked!')
    return
  }
  
  const newProduct = {
    ...product,
    id: generateId(),
    addedAt: Date.now(),
    priceHistory: [{
      date: new Date().toISOString().split('T')[0],
      price: product.currentPrice
    }],
    lowestPrice: product.currentPrice,
    highestPrice: product.currentPrice,
  }
  
  products.push(newProduct)
  await saveData()
  render()
}

async function removeProduct(id) {
  products = products.filter(p => p.id !== id)
  await saveData()
  render()
}

async function setCheckInterval(value) {
  checkInterval = value
  await saveData()
  render()
}

// Cloud-based premium system (private URL - not discoverable)
const PREMIUM_API_URL = 'https://raw.githubusercontent.com/muddsarnaeemsiddiqi/daraz-tracker-premium/main/p_5c6956ba2bbf4b499b8091931023d80e.json'

// Demo mode - set to false to use cloud
const DEMO_MODE = false
const DEMO_EMAILS = ['demo@example.com']

// Fetch allowed emails from cloud
async function fetchAllowedEmails() {
  if (DEMO_MODE) {
    return DEMO_EMAILS
  }
  
  try {
    const response = await fetch(PREMIUM_API_URL)
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    return data.emails || DEMO_EMAILS
  } catch (e) {
    console.log('Using demo emails')
    return DEMO_EMAILS
  }
}

// Handle premium upgrade - requires logged in Chrome account
async function handlePremiumUpgrade() {
  // Get the currently signed-in Chrome user
  let userEmail = ''
  
  try {
    const userInfo = await chrome.identity.getProfileUserInfo()
    userEmail = userInfo.email?.toLowerCase() || ''
  } catch (e) {
    console.log('Could not get Chrome profile info:', e)
  }
  
  if (!userEmail) {
    alert('Please sign in to Chrome with your Gmail account to verify premium access.\n\n1. Click your profile icon in Chrome\n2. Sign in or select your account\n3. Try again')
    return
  }
  
  // Check if this Chrome email is allowed
  const btn = document.getElementById('upgrade-btn')
  if (btn) btn.textContent = 'Verifying...'
  
  const allowedEmails = await fetchAllowedEmails()
  
  if (allowedEmails.includes(userEmail)) {
    isPremium = true
    premiumEmail = userEmail  // Store the email
    await saveData()
    render()
    alert('Premium activated for ' + userEmail + '!')
  } else {
    if (btn) btn.textContent = 'Verify'
    alert('Premium not available for: ' + userEmail + '\n\nThis email must be added by the developer.\nContact: L104732@gmail.com')
  }
}

// Fetch price from Daraz using content script (for accurate rendered price)
async function fetchPrice(url) {
  try {
    // Find the tab with this URL
    const tabs = await chrome.tabs.query({})
    const tab = tabs.find(t => t.url && t.url.includes('daraz.pk') && t.url.includes(url.split('/').slice(-2)[0]))
    
    if (tab && tab.id) {
      // Use content script to get the rendered price
      return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, { type: 'GET_CURRENT_PRODUCT' }, (productInfo) => {
          if (productInfo && productInfo.price > 0) {
            resolve(productInfo.price)
          } else {
            resolve(0)
          }
        })
      })
    }
    
    // Fallback: try fetch if tab not found
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    if (!response.ok) return 0
    const html = await response.text()
    
    // Find all prices and return the LOWEST (usually sale price)
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
    
    return 0
  } catch (e) {
    console.error('Error fetching price:', e)
    return 0
  }
}

// Update single product price
async function updateProductPrice(id) {
  const product = products.find(p => p.id === id)
  if (!product) return
  
  const newPrice = await fetchPrice(product.url)
  
  if (newPrice > 0) {
    const index = products.findIndex(p => p.id === id)
    products[index] = {
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
    await saveData()
    render()
  }
}

// Manual price update
async function updatePriceManually(id) {
  const product = products.find(p => p.id === id)
  if (!product) return
  
  const newPriceStr = prompt('Enter new price for this product:', product.currentPrice)
  if (!newPriceStr) return
  
  const newPrice = parseInt(newPriceStr.replace(/,/g, ''))
  if (isNaN(newPrice) || newPrice <= 0) {
    alert('Please enter a valid price')
    return
  }
  
  const index = products.findIndex(p => p.id === id)
  products[index] = {
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
  await saveData()
  render()
}

// Update all product prices
async function refreshAllPrices() {
  const refreshBtn = document.getElementById('refresh-btn')
  refreshBtn.innerHTML = '<span class="spinner"></span>'
  refreshBtn.disabled = true

  let updatedCount = 0
  let tabFound = false

  // Check if any Daraz tab is open
  const tabs = await chrome.tabs.query({})
  const darazTabs = tabs.filter(t => t.url && t.url.includes('daraz.pk'))
  
  if (darazTabs.length === 0) {
    alert('Please open your tracked Daraz product pages first, then click refresh. This ensures we get the latest prices.')
  }

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const newPrice = await fetchPrice(product.url)
    
    if (newPrice > 0 && newPrice !== product.currentPrice) {
      products[i] = {
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
      updatedCount++
    }
  }

  await saveData()
  render()
}

async function trackCurrentPage() {
  try {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab[0]?.url?.includes('daraz.pk')) {
      chrome.tabs.sendMessage(tab[0].id, { type: 'GET_CURRENT_PRODUCT' }, (productInfo) => {
        if (productInfo) {
          addProduct({
            url: productInfo.url,
            name: productInfo.name,
            image: productInfo.image,
            originalPrice: productInfo.price,
            currentPrice: productInfo.price,
          })
        }
      })
    } else {
      alert('Please navigate to a Daraz product page first')
    }
  } catch (e) {
    console.error('Error tracking page:', e)
  }
}

async function addFromUrl() {
  const urlInput = document.getElementById('url-input')
  const url = urlInput.value.trim()
  if (!url) return
  
  addProduct({
    url,
    name: 'Product ' + products.length + 1,
    image: '',
    originalPrice: 0,
    currentPrice: 0,
  })
  
  urlInput.value = ''
}

function render() {
  const app = document.getElementById('app')
  
  app.innerHTML = `
    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div class="header-title">
          ${icons.bell}
          <span>Daraz Price Tracker</span>
        </div>
        <div class="header-actions">
          <button id="refresh-btn" class="settings-btn" title="Update all prices">
            ${icons.refresh}
          </button>
          <button id="settings-btn" class="settings-btn">
            ${icons.settings}
          </button>
        </div>
      </div>
      
      <div class="tabs">
        <button id="tab-products" class="tab ${currentTab === 'products' ? 'tab-active' : 'tab-inactive'}">
          My Products (${products.length})
        </button>
        <button id="tab-add" class="tab ${currentTab === 'add' ? 'tab-active' : 'tab-inactive'}">
          ${icons.plus}
          Add Product
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    ${showSettings ? `
    <div class="settings-panel">
      <h3 class="settings-title">Settings</h3>
      <div class="form-group">
        <label class="form-label">Check Interval</label>
        <select id="interval-select" class="form-select">
          <option value="1" ${checkInterval === 1 ? 'selected' : ''}>Every hour</option>
          <option value="6" ${checkInterval === 6 ? 'selected' : ''}>Every 6 hours</option>
          <option value="12" ${checkInterval === 12 ? 'selected' : ''}>Every 12 hours</option>
          <option value="24" ${checkInterval === 24 ? 'selected' : ''}>Every 24 hours</option>
        </select>
      </div>
      ${!isPremium ? `
      <div class="premium-box">
        <div class="premium-header">
          ${icons.crown}
          <span>Upgrade to Premium</span>
        </div>
        <p class="premium-text">Track unlimited products, export to CSV, and more!</p>
        <div class="premium-email-row">
          <input type="email" id="upgrade-email" placeholder="Enter your email" class="premium-email-input">
          <button id="upgrade-btn" class="premium-btn-small">Verify</button>
        </div>
        <p class="premium-hint">Contact: L104732@gmail.com for premium</p>
      </div>
      ` : '<div class="premium-box"><div class="premium-header">' + icons.crown + '<span>Premium Active</span></div><p class="premium-text">Unlimited product tracking enabled!</p></div>'}
    </div>
    ` : ''}

    <!-- Content -->
    <div class="content">
      ${currentTab === 'products' ? `
      <div>
        ${!canAddProduct() && !isPremium ? `
        <div class="limit-warning">
          Free plan: ${products.length}/10 products. <span class="limit-link" id="upgrade-link">Upgrade</span> for unlimited.
        </div>
        ` : ''}

        ${products.length === 0 ? `
        <div class="empty-state">
          ${icons.bell}
          <p>No products tracked yet</p>
          <p class="empty-link" id="add-first">Add your first product</p>
        </div>
        ` : products.map(product => {
          const priceChange = product.currentPrice - product.originalPrice
          const priceChangePercent = product.originalPrice > 0 ? ((priceChange / product.originalPrice) * 100).toFixed(1) : '0'
          const isDrop = priceChange < 0
          
          return `
          <div class="product-card">
            <div class="product-row">
              ${product.image 
                ? `<img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"> 
                   <div class="product-img-placeholder" style="display:none">${icons.package}</div>` 
                : `<div class="product-img-placeholder">${icons.package}</div>`}
              <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-row">
                  <span class="product-price">${formatPrice(product.currentPrice)}</span>
                  <span class="price-change ${isDrop ? 'price-drop' : 'price-up'}">
                    ${isDrop ? icons.trendingDown : icons.trendingUp}
                    ${Math.abs(parseFloat(priceChangePercent))}%
                  </span>
                </div>
                <div class="product-range">
                  <span>Low: ${formatPrice(product.lowestPrice)}</span>
                  <span>High: ${formatPrice(product.highestPrice)}</span>
                </div>
              </div>
              <div class="product-actions">
                <button data-refresh="${product.id}" class="action-btn" title="Refresh price">
                  ${icons.refresh}
                </button>
                <button data-remove="${product.id}" class="delete-btn">
                  ${icons.trash}
                </button>
              </div>
            </div>
            <div class="product-links">
              <a href="${product.url}" target="_blank" class="view-link">
                View on Daraz ${icons.externalLink}
              </a>
              <button data-edit="${product.id}" class="edit-link">
                Edit Price
              </button>
            </div>
          </div>
          `
        }).join('')}
      </div>
      ` : `
      <div>
        <div class="add-section">
          <p>Add products to track their prices</p>
          
          <button id="track-current" class="track-btn">
            ${icons.plus}
            Track Current Page
          </button>
          
          <div class="divider">
            <div class="divider-line"></div>
            <span class="divider-text">or</span>
            <div class="divider-line"></div>
          </div>

          <div class="url-row">
            <input id="url-input" type="text" placeholder="Paste Daraz product URL..." class="url-input">
            <button id="add-url" class="add-url-btn">Add</button>
          </div>
        </div>

        ${products.length > 0 ? `
        <button id="view-all" class="view-all-btn">
          View all tracked products →
        </button>
        ` : ''}
      </div>
      `}
    </div>
  `
}

function setupEventListeners() {
  document.addEventListener('click', async (e) => {
    const target = e.target
    
    if (target.closest('#settings-btn')) {
      showSettings = !showSettings
      render()
      return
    }
    
    if (target.closest('#refresh-btn')) {
      await refreshAllPrices()
      return
    }
    
    if (target.closest('#tab-products')) {
      currentTab = 'products'
      render()
      return
    }
    if (target.closest('#tab-add')) {
      currentTab = 'add'
      render()
      return
    }
    
    if (target.closest('#add-first')) {
      currentTab = 'add'
      render()
      return
    }
    
    if (target.closest('#track-current')) {
      await trackCurrentPage()
      return
    }
    
    if (target.closest('#add-url')) {
      await addFromUrl()
      return
    }
    
    if (target.closest('#view-all')) {
      currentTab = 'products'
      render()
      return
    }
    
    const removeBtn = target.closest('[data-remove]')
    if (removeBtn) {
      const id = removeBtn.dataset.remove
      await removeProduct(id)
      return
    }
    
    const refreshBtn = target.closest('[data-refresh]')
    if (refreshBtn) {
      const id = refreshBtn.dataset.refresh
      await updateProductPrice(id)
      return
    }
    
    const editBtn = target.closest('[data-edit]')
    if (editBtn) {
      const id = editBtn.dataset.edit
      await updatePriceManually(id)
      return
    }
    
    if (target.closest('#upgrade-btn') || target.closest('#upgrade-link')) {
      await handlePremiumUpgrade()
      return
    }
  })
  
  document.addEventListener('change', async (e) => {
    if (e.target.id === 'interval-select') {
      await setCheckInterval(parseInt(e.target.value))
    }
  })
  
  document.addEventListener('keypress', async (e) => {
    if (e.target.id === 'url-input' && e.key === 'Enter') {
      await addFromUrl()
    }
  })
}
