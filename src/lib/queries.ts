export const featuredPhotosQuery = `
  *[_type == "post"] {
    "photos": gallery[featured == true] {
      image,
      caption,
      "postSlug": ^.slug.current,
      "postTitle": ^.title
    }
  }
`

export const upcomingShowsQuery = `
  *[_type == "show" && date >= $today] | order(date asc) {
    band,
    venue,
    city,
    location,
    date
  }
`

export const featuredPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) [0...2] {
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage,
    locations
  }
`

export const latestPostQuery = `
  *[_type == "post"] | order(publishedAt desc) [0] {
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage,
    locations
  }
`

export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage,
    locations
  }
`