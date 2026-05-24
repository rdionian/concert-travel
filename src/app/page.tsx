import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import Nav from '@/components/nav'
import { featuredPostsQuery, upcomingShowsQuery, latestPostQuery, featuredPhotosQuery } from '@/lib/queries'

export const revalidate = 60

export default async function Home() {
  const today = new Date().toISOString().split('T')[0]
  
  const [featuredPosts, upcomingShows, latestPost, featuredPhotosPosts] = await Promise.all([
    client.fetch(featuredPostsQuery),
    client.fetch(upcomingShowsQuery, { today }),
    client.fetch(latestPostQuery),
    client.fetch(featuredPhotosQuery),
  ])

  const featuredPhotos = featuredPhotosPosts
    .flatMap((p: any) => p.photos || [])
    .slice(0, 6)

  return (
    <main className="bg-black text-white min-h-screen">
  
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/EpicaHero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
            Robb on Tour
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
            Traveling the world for the music that moves me.
          </p>
          <Link
            href="/blog"
            className="border border-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            Read the Blog
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-white/10 max-w-7xl mx-auto px-6 py-24">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">About Robb</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            I'm a software engineer from Florida who's spent the last few years turning concert weekends into full trips.
            It started about four years ago — one show led to another, and somewhere along the way I realized I was planning entire vacations around tour dates. Symphonic metal is the obsession, but power metal and folk metal keep the playlist interesting and the travel itinerary unpredictable.
            When I'm not chasing bands across continents, I'm building things — games and websites through my web dev business based out of Florida. This site is as much a portfolio piece as it is a travel diary.
            If you've ever driven 16 hours to catch a band, or booked a flight because your favorite artist announced a European tour — you're in the right place.
          </p>
        </div>
      </section>

      {/* Latest Post */}
      {latestPost && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Latest Trip</h2>
          <Link href={`/blog/${latestPost.slug.current}`} className="group block">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-white/10 p-8 hover:border-white/40 transition-all duration-300">
              {latestPost.coverImage && (
                <div className="overflow-hidden">
                  <img
                    src={urlFor(latestPost.coverImage).width(800).url()}
                    alt={latestPost.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-3">
                  {new Date(latestPost.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
                <h3 className="text-2xl font-semibold mb-4">{latestPost.title}</h3>
                {latestPost.excerpt && (
                  <p className="text-gray-400 leading-relaxed mb-6">{latestPost.excerpt}</p>
                )}
                <span className="text-sm uppercase tracking-widest border-b border-white/40 pb-1 w-fit group-hover:border-white transition-all duration-300">
                  Read More
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Featured Trips */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Featured Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post: any) => (
              <Link href={`/blog/${post.slug.current}`} key={post.slug.current} className="group">
                <div className="border border-white/10 p-8 hover:border-white/40 transition-all duration-300">
                  {post.coverImage && (
                    <div className="overflow-hidden mb-6">
                      <img
                        src={urlFor(post.coverImage).width(600).url()}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <p className="text-gray-500 text-sm uppercase tracking-widest mb-3">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  {post.locations && (
                    <p className="text-gray-500 text-sm">{post.locations.join(' · ')}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Photos */}
      {featuredPhotos.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Favorite Shots</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredPhotos.map((photo: any, i: number) => (
              <Link href={`/blog/${photo.postSlug}`} key={i} className="group overflow-hidden">
                <img
                  src={urlFor(photo.image).width(600).height(400).url()}
                  alt={photo.caption || photo.postTitle}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Shows */}
      {upcomingShows.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Upcoming Shows</h2>
          <div className="flex flex-col divide-y divide-white/10">
            {upcomingShows.map((show: any) => (
              <div key={`${show.band}-${show.date}`} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{show.band}</h3>
                  <p className="text-gray-500 text-sm mt-1">{show.venue} · {show.city}, {show.location}</p>
                </div>
                <p className="text-gray-400 text-sm uppercase tracking-widest">
                  {new Date(show.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}