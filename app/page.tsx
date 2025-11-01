'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [selector, setSelector] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<string[]>([])

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, selector }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape')
      }

      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Web Scraper</h1>
        <p>Extract content from any website using CSS selectors</p>
      </div>

      <form className="scraper-form" onSubmit={handleScrape}>
        <div className="input-group">
          <input
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Scraping...' : 'Scrape'}
          </button>
        </div>
        <input
          type="text"
          className="selector-input"
          placeholder="CSS Selector (e.g., h1, .title, #content)"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          required
        />
        <p className="selector-hint">
          Enter a CSS selector to target specific elements. Leave empty to get all text.
        </p>
      </form>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Scraping website...</div>}

      {results.length > 0 && (
        <div className="results">
          <h2>Results ({results.length} items found)</h2>
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <strong>Item {index + 1}:</strong>
              <pre>{result}</pre>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && results.length === 0 && url && (
        <div className="no-results">No results found. Try a different selector.</div>
      )}
    </div>
  )
}
