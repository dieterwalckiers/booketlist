import BlogListing from 'components/blog/BlogListing'
import Layout from 'components/layout'
import { NavItem } from 'components/navbar/contract'
import { fetchAllBlogPosts, fetchMenuProps } from 'helpers/fetching'
import Head from 'next/head'
import React from 'react'
import { BlogPostSummary } from 'shared/contract'

interface Props {
  posts: BlogPostSummary[]
  navItems: NavItem[]
  settings: Record<string, unknown>
}

const BlogIndex: React.FC<Props> = ({ posts, navItems, settings }) => {
  return (
    <>
      <Head>
        <title>Blog | Booketlist Agency</title>
      </Head>
      <Layout navItems={navItems} settings={settings}>
        <BlogListing posts={posts} />
      </Layout>
    </>
  )
}

export default BlogIndex

export async function getStaticProps() {
  const { navItems, settings } = await fetchMenuProps()
  const posts = await fetchAllBlogPosts()
  return {
    props: {
      navItems,
      settings,
      posts,
    },
  }
}
