import BlogPostDetail from 'components/blog/BlogPostDetail'
import Layout from 'components/layout'
import { NavItem } from 'components/navbar/contract'
import {
  fetchAllBlogPostSlugs,
  fetchBlogPost,
  fetchMenuProps,
} from 'helpers/fetching'
import Head from 'next/head'
import React from 'react'
import { BlogPost } from 'shared/contract'

interface Props {
  post: BlogPost
  navItems: NavItem[]
  settings: Record<string, unknown>
}

const BlogPostPage: React.FC<Props> = ({ post, navItems, settings }) => {
  return (
    <>
      <Head>
        <title>{post.title} | Booketlist Agency</title>
        {post.excerpt && <meta name="description" content={post.excerpt} />}
      </Head>
      <Layout navItems={navItems} settings={settings}>
        <BlogPostDetail post={post} />
      </Layout>
    </>
  )
}

export default BlogPostPage

export async function getStaticProps({ params }) {
  const { navItems, settings } = await fetchMenuProps()
  const post = await fetchBlogPost(params.slug)
  return {
    props: {
      navItems,
      settings,
      post,
    },
  }
}

export async function getStaticPaths() {
  const allSlugs = await fetchAllBlogPostSlugs()
  const paths = allSlugs.map((slug) => ({
    params: { slug },
  }))
  return {
    paths,
    fallback: false,
  }
}
