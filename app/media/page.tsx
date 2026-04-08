import { fetchInstagramPosts } from '@/lib/instagram';
import MediaGrid from '@/components/MediaGrid';
import InstagramConnect from '@/components/InstagramConnect';

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const hasToken = !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID);
  const hasAppId = !!process.env.FACEBOOK_APP_ID;
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
        <InstagramConnect
          hasAppId={hasAppId}
          connected={params.connected === 'true'}
          igUserId={params.ig_user_id}
          tokenPreview={params.token_preview}
          fullToken={params.full_token}
          error={params.error}
        />
      )}
    </div>
  );
}
