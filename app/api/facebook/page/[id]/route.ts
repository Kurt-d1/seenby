import { NextRequest, NextResponse } from "next/server"

var accessToken = process.env.FACEBOOK_ACCESS_TOKEN || ""

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    var { id } = await params

    if (!accessToken) {
      return NextResponse.json({ error: "Facebook access token not configured" }, { status: 500 })
    }

    console.log("Fetching Facebook page:", id)

    // Get detailed page info
    var pageUrl = "https://graph.facebook.com/v18.0/" + id +
      "?fields=id,name,fan_count,followers_count,link,category,about,website,posts.limit(10){created_time,message,shares,likes.summary(true),comments.summary(true)}" +
      "&access_token=" + accessToken

    var pageResponse = await fetch(pageUrl)
    var pageData = await pageResponse.json()

    if (pageData.error) {
      console.error("Facebook page error:", pageData.error)
      return NextResponse.json({ error: pageData.error.message }, { status: 400 })
    }

    // Calculate engagement metrics from recent posts
    var posts = pageData.posts?.data || []
    var totalEngagement = 0
    var postCount = posts.length

    posts.forEach(function(post: any) {
      var likes = post.likes?.summary?.total_count || 0
      var comments = post.comments?.summary?.total_count || 0
      var shares = post.shares?.count || 0
      totalEngagement += likes + comments + shares
    })

    var avgEngagement = postCount > 0 ? totalEngagement / postCount : 0
    var followers = pageData.followers_count || pageData.fan_count || 0
    var engagementRate = followers > 0 ? (avgEngagement / followers) * 100 : 0

    // Estimate posts per month (based on last 10 posts timespan)
    var postsPerMonth = 0
    if (posts.length >= 2) {
      var newest = new Date(posts[0].created_time)
      var oldest = new Date(posts[posts.length - 1].created_time)
      var daysDiff = (newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff > 0) {
        postsPerMonth = Math.round((posts.length / daysDiff) * 30)
      }
    }

    var result = {
      id: pageData.id,
      name: pageData.name,
      followers: followers,
      category: pageData.category || null,
      link: pageData.link || "https://facebook.com/" + pageData.id,
      website: pageData.website || null,
      about: pageData.about || null,
      posts_per_month: postsPerMonth,
      avg_engagement: Math.round(avgEngagement),
      engagement_rate: parseFloat(engagementRate.toFixed(2))
    }

    console.log("Facebook page data:", result.name, "-", result.followers, "followers")

    return NextResponse.json(result)

  } catch (error) {
    console.error("Facebook page fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}