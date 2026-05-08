const APP_URL = 'https://recall-next.vercel.app' // Replace with your production URL

document.getElementById('saveBtn').addEventListener('click', async () => {
  const statusEl = document.getElementById('status')
  const btn = document.getElementById('saveBtn')
  
  btn.disabled = true
  statusEl.textContent = 'Saving...'

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    
    const res = await fetch(`${APP_URL}/api/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tab.url }),
    })

    if (res.status === 401) {
      statusEl.textContent = 'Please log in to Recall first.'
      window.open(`${APP_URL}/login`)
    } else if (res.ok) {
      statusEl.textContent = 'Saved successfully!'
      setTimeout(() => window.close(), 1500)
    } else {
      throw new Error('Failed to save')
    }
  } catch (error) {
    statusEl.textContent = 'Error: ' + error.message
    btn.disabled = false
  }
})
