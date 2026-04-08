import { fetchInstagramPosts } from '@/lib/instagram';
import MediaGrid from '@/components/MediaGrid';

export default async function MediaPage() {
  const posts = await fetchInstagramPosts();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Media</h1>
        <p className="text-sm text-[#666666] mt-1">Recent Instagram posts from @rizinternational</p>
      </div>
      <MediaGrid posts={posts} />
    </div>
  );
}
