import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import { allPostsQuery } from '@/lib/queries'

export const revalidate = 60

export default async function BlogPage() {
  const posts = await client.fetch(allPostsQuery)

  return (
    <main className="bg-black text-white min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight mb-16">Blog</h1>

        <div className="flex flex-col gap-8">
          {posts.map((post: any) => (
            <Link
              key={post.slug.current}
              href={`/blog/${post.slug.current}`}
              className="group border border-white/10 hover:border-white/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                {post.coverImage && (
                  <div className="md:w-72 md:flex-shrink-0 overflow-hidden">
                    <img
                      src={urlFor(post.coverImage).width(600).height(400).url()}
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center p-8 gap-4">
                  <p className="text-gray-500 text-sm uppercase tracking-widest">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <h2 className="text-2xl font-semibold group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-400 leading-relaxed">{post.excerpt}</p>
                  )}
                  {post.locations && (
                    <p className="text-gray-500 text-sm">{post.locations.join(' · ')}</p>
                  )}
                  <span className="text-sm uppercase tracking-widest border-b border-white/40 pb-1 w-fit group-hover:border-white transition-all duration-300">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}