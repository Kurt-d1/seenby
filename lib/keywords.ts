// Keyword extraction from business data

export interface BusinessKeywords {
  primary_category: string
  categories: string[]
  keywords: string[]
  services: string[]
}

// Extract keywords from Google Place types
export function extractFromGoogleTypes(types: string[]): string[] {
  // Filter out generic types
  var genericTypes = [
    "point_of_interest",
    "establishment",
    "food",
    "store",
    "place_of_worship"
  ]
  
  return types
    .filter(function(type) {
      return genericTypes.indexOf(type) === -1
    })
    .map(function(type) {
      return type.replace(/_/g, " ")
    })
    .slice(0, 5)
}

// Extract keywords from business name
export function extractFromName(name: string): string[] {
  var stopWords = [
    "the", "a", "an", "and", "or", "of", "in", "at", "to", "for",
    "is", "on", "with", "by", "from", "as", "ltd", "limited", "llc",
    "inc", "co", "company", "group", "malta", "gozo"
  ]
  
  var words = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(function(word) {
      return word.length > 2 && stopWords.indexOf(word) === -1
    })
  
  return words.slice(0, 5)
}

// Extract keywords from website meta description and content
export function extractFromWebsite(content: {
  title?: string
  metaDescription?: string
  headings?: string[]
  bodyText?: string
}): string[] {
  var allText = ""
  
  if (content.title) {
    allText += " " + content.title
  }
  if (content.metaDescription) {
    allText += " " + content.metaDescription
  }
  if (content.headings) {
    allText += " " + content.headings.join(" ")
  }
  
  var stopWords = [
    "the", "a", "an", "and", "or", "of", "in", "at", "to", "for",
    "is", "on", "with", "by", "from", "as", "we", "our", "your",
    "you", "us", "are", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "will", "would", "could", "should", "may",
    "might", "must", "shall", "can", "need", "dare", "ought", "used",
    "welcome", "home", "page", "website", "site", "contact", "about",
    "services", "products", "more", "click", "here", "read", "learn"
  ]
  
  var words = allText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(function(word) {
      return word.length > 3 && stopWords.indexOf(word) === -1
    })
  
  // Count word frequency
  var wordCount: { [key: string]: number } = {}
  words.forEach(function(word) {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  // Sort by frequency and return top keywords
  var sortedWords = Object.keys(wordCount).sort(function(a, b) {
    return wordCount[b] - wordCount[a]
  })
  
  return sortedWords.slice(0, 10)
}

// Combine all keyword sources and deduplicate
export function combineKeywords(
  googleTypes: string[],
  nameKeywords: string[],
  websiteKeywords: string[]
): BusinessKeywords {
  var allKeywords: string[] = []
  
  // Add Google types (highest priority)
  googleTypes.forEach(function(kw) {
    if (allKeywords.indexOf(kw) === -1) {
      allKeywords.push(kw)
    }
  })
  
  // Add name keywords
  nameKeywords.forEach(function(kw) {
    if (allKeywords.indexOf(kw) === -1) {
      allKeywords.push(kw)
    }
  })
  
  // Add website keywords
  websiteKeywords.forEach(function(kw) {
    if (allKeywords.indexOf(kw) === -1) {
      allKeywords.push(kw)
    }
  })
  
  return {
    primary_category: googleTypes[0] || nameKeywords[0] || "business",
    categories: googleTypes,
    keywords: allKeywords.slice(0, 10),
    services: websiteKeywords.slice(0, 5)
  }
}

// Build search query for finding competitors
export function buildCompetitorSearchQuery(keywords: BusinessKeywords): string {
  var queryParts: string[] = []
  
  // Add primary category
  if (keywords.primary_category) {
    queryParts.push(keywords.primary_category)
  }
  
  // Add top 2 keywords
  keywords.keywords.slice(0, 2).forEach(function(kw) {
    if (queryParts.indexOf(kw) === -1) {
      queryParts.push(kw)
    }
  })
  
  return queryParts.join(" ")
}