import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url, selector } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    })

    const html = response.data
    const $ = cheerio.load(html)

    let results: string[] = []

    if (selector) {
      // Use the provided selector
      $(selector).each((_, element) => {
        const text = $(element).text().trim()
        if (text) {
          results.push(text)
        }
      })
    } else {
      // Default: get main content
      const text = $('body').text().trim()
      results = text.split('\n').filter(line => line.trim().length > 0).slice(0, 50)
    }

    return NextResponse.json({
      results,
      count: results.length
    })
  } catch (error) {
    console.error('Scraping error:', error)

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while scraping' },
      { status: 500 }
    )
  }
}
