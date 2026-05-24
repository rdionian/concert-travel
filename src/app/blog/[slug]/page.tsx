import { client, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`)
  return slugs.map((s: any) => ({ slug: s.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      publishedAt,
      coverImage,
      excerpt,
      locations,
      bands,
      body,
      gallery
    }
  `, { slug })

  if (!post) notFound()

  return (
    <main className="bg-black text-white min-h-screen">

      {/* Hero */}
      <section className="relative w-full aspect-[16/8] overflow-hidden">
        {post.coverImage && (
          <img
            src={urlFor(post.coverImage).width(1600).url()}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 right-0 max-w-7xl w-full mx-auto px-6 pb-12 flex flex-col items-end">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl text-right">
            {post.title}
          </h1>
          {post.locations && (
            <p className="text-gray-400 text-sm uppercase tracking-widest mt-4">
              {post.locations.join(' · ')}
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {post.bands && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.bands.map((band: string) => (
              <span
                key={band}
                className="text-xs uppercase tracking-widest border border-white/20 px-3 py-1 text-gray-400"
              >
                {band}
              </span>
            ))}
          </div>
        )}

        {post.body && (
          <div className="text-gray-300 leading-relaxed space-y-6 text-lg [&>h2]:text-white [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:text-gray-300 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2">
            <PortableText value={post.body} />
          </div>
        )}
      </article>

      {/* Gallery */}
      {post.gallery && post.gallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold mb-8 tracking-tight">Photos</h2>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {post.gallery.map((item: any, i: number) => (
              <div key={i} className="break-inside-avoid">
                <img
                  src={urlFor(item.image).width(800).url()}
                  alt={item.caption || post.title}
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {item.caption && (
                  <p className="text-gray-500 text-sm mt-2 mb-4">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}