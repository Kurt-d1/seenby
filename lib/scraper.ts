// Website scraper for extracting business information

import * as cheerio from "cheerio"

export interface WebsiteContent {
  title: string | undefined
  metaDescription: string | undefined
  headings: string[]
  bodyText: string
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  contactInfo: {
    email?: string
    phone?: string
    address?: string
  }
}

export async function scrapeWebsite(url: string): Promise<WebsiteContent | null> {
  try {
    // Add https if missing
    if (!url.startsWith("http")) {
      url = "https://" + url
    }
    
    var response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SeenByBot/1.0; +https://seenby.io)"
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (!response.ok) {
      console.error("Failed to fetch website:", response.status)
      return null
    }
    
    var html = await response.text()
    var $ = cheerio.load(html)
    
    // Extract title
    var title = $("title").first().text().trim() || undefined
    
    // Extract meta description
    var metaDescription = $('meta[name="description"]').attr("content")?.trim() || 
                          $('meta[property="og:description"]').attr("content")?.trim() ||
                          undefined
    
    // Extract headings (h1, h2, h3)
    var headings: string[] = []
    $("h1, h2, h3").each(function() {
      var text = $(this).text().trim()
      if (text && text.length > 2 && text.length < 200) {
        headings.push(text)
      }
    })
    
    // Extract body text (simplified)
    $("script, style, nav, footer, header").remove()
    var bodyText = $("body").text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000) // Limit text length
    
    // Extract social links
    var socialLinks: WebsiteContent["socialLinks"] = {}
    $("a[href]").each(function() {
      var href = $(this).attr("href") || ""
      if (href.includes("facebook.com")) {
        socialLinks.facebook = href
      } else if (href.includes("instagram.com")) {
        socialLinks.instagram = href
      } else if (href.includes("twitter.com") || href.includes("x.com")) {
        socialLinks.twitter = href
      } else if (href.includes("linkedin.com")) {
        socialLinks.linkedin = href
      }
    })
    
    // Extract contact info
    var contactInfo: WebsiteContent["contactInfo"] = {}
    
    // Find email
    var emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (emailMatch) {
      contactInfo.email = emailMatch[0]
    }
    
    // Find phone (Malta format)
    var phoneMatch = html.match(/(\+356|00356)?[\s.-]?[0-9]{4}[\s.-]?[0-9]{4}/)
    if (phoneMatch) {
      contactInfo.phone = phoneMatch[0].replace(/[\s.-]/g, "")
    }
    
    return {
      title,
      metaDescription,
      headings: headings.slice(0, 10),
      bodyText,
      socialLinks,
      contactInfo
    }
    
  } catch (error) {
    console.error("Scraper error:", error)
    return null
  }
}

// Check if a URL is valid and accessible
export async function checkWebsiteAccessible(url: string): Promise<boolean> {
  try {
    if (!url.startsWith("http")) {
      url = "https://" + url
    }
    
    var response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000)
    })
    
    return response.ok
  } catch {
    return false
  }
}