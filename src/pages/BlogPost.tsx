import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogPostPage from "@/components/BlogPostPage";
import NotFound from "./NotFound";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  return (
    <>
      <Helmet>
        <title>{post.pageTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://biologicapets.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.pageTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.heroImage} />
        <meta property="og:type" content="article" />
      </Helmet>
      <BlogPostPage
        category={post.category}
        title={post.title}
        heroImage={post.heroImage}
        heroImageAlt={post.title}
      >
        {post.content.map((para, i) => {
          if (para.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="mt-10 mb-4 font-sans text-2xl md:text-3xl font-bold tracking-tight text-foreground"
              >
                {para.replace("## ", "")}
              </h2>
            );
          }
          return (
            <p key={i} className="mb-6">
              {para}
            </p>
          );
        })}
      </BlogPostPage>
    </>
  );
};

export default BlogPost;
