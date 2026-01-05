import { MetadataRoute } from 'next'
import { getPostsAPI } from '@/queries/server/posts'

// Make this route dynamic to avoid build-time errors
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function generateSitemaps() {
  const length = Math.ceil(1 / 10000)

  // Fetch the total number of posts and calculate the number of sitemaps needed
  return Array.from({ length }).map((_, i) => ({ id: i + 1 }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  try {
    // Google's limit is 50,000 URLs per sitemap
    const { posts } = await getPostsAPI(null, {
      page: id,
      perPage: 10000,
      postType: 'post',
      status: 'publish',
    })

    if (Array.isArray(posts) && posts?.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        const { permalink, date } = posts[i]
        routes.push({ url: permalink ?? '', lastModified: date ?? '' })
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return empty sitemap on error (will be populated at runtime)
  }

  return routes
}
