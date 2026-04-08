import { fetchInstagramPosts } from '@/lib/instagram';
import MediaGrid from '@/components/MediaGrid';
import InstagramConnect from '@/components/InstagramConnect';

export default async function MediaPage() {
  const hasToken = !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID);
  const posts = hasToken ? await fetchInstagramPosts() : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Media</h1>
        <p className="text-sm text-[#666666] mt-1">Instagram posts from @rizinternational</p>
      </div>
      {hasToken && posts.length > 0 ? (
        <MediaGrid posts={posts} />
      ) : (
        <InstagramConnect />
      )}
    </div>
  );
}
