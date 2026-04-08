export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink: string;
}

export interface PostInsights {
  id: string;
  impressions: number;
  reach: number;
  engagement: number;
  saved: number;
  shares: number;
  likes: number;
  comments: number;
}

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  if (INSTAGRAM_ACCESS_TOKEN && INSTAGRAM_USER_ID) {
    const res = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.data as InstagramPost[];
    }
  }
  return getMockPosts();
}

export async function fetchPostInsights(mediaId: string): Promise<PostInsights | null> {
  if (INSTAGRAM_ACCESS_TOKEN) {
    const res = await fetch(
      `https://graph.instagram.com/${mediaId}/insights?metric=impressions,reach,engagement,saved,shares&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.data as PostInsights;
    }
  }
  return null;
}

function getMockPosts(): InstagramPost[] {
  const now = new Date();
  return [
    {
      id: '1',
      caption: 'The market doesn\'t reward emotions — it rewards discipline. Here\'s how I manage risk on every single trade. Save this for later. #trading #riskmanagement #forex',
      media_type: 'CAROUSEL_ALBUM',
      media_url: '/mock/post1.jpg',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock1',
    },
    {
      id: '2',
      caption: 'Stop chasing trades. Start building systems. The difference between a gambler and a trader is a plan. 📊 #tradingpsychology #mindset',
      media_type: 'IMAGE',
      media_url: '/mock/post2.jpg',
      timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock2',
    },
    {
      id: '3',
      caption: 'New reel: 3 mistakes I see beginners make every single week. Which one are you guilty of? Drop a comment 👇 #forextrading #beginnertrader',
      media_type: 'VIDEO',
      media_url: '/mock/post3.jpg',
      thumbnail_url: '/mock/post3-thumb.jpg',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock3',
    },
    {
      id: '4',
      caption: 'Conscious capitalism isn\'t just a buzzword — it\'s how we build sustainable wealth. Here are 5 principles every investor should know. Thread 🧵',
      media_type: 'CAROUSEL_ALBUM',
      media_url: '/mock/post4.jpg',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock4',
    },
    {
      id: '5',
      caption: 'Monday motivation: Your portfolio is a reflection of your patience. Not your predictions. 💡 #investing #wealthbuilding',
      media_type: 'IMAGE',
      media_url: '/mock/post5.jpg',
      timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock5',
    },
    {
      id: '6',
      caption: 'Breaking down this week\'s EUR/USD setup. Key levels, entry zones, and my game plan. Full analysis inside ➡️ #forex #eurusd #technicalanalysis',
      media_type: 'VIDEO',
      media_url: '/mock/post6.jpg',
      thumbnail_url: '/mock/post6-thumb.jpg',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock6',
    },
    {
      id: '7',
      caption: 'Ethics in trading is underrated. Here\'s why I believe transparency builds better traders and better communities. #ethics #tradingcommunity',
      media_type: 'CAROUSEL_ALBUM',
      media_url: '/mock/post7.jpg',
      timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock7',
    },
    {
      id: '8',
      caption: 'The sensible approach to growing your account: compound gains, manage drawdowns, stay consistent. It\'s not sexy but it works. 📈',
      media_type: 'IMAGE',
      media_url: '/mock/post8.jpg',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock8',
    },
    {
      id: '9',
      caption: 'Market news recap: Fed holds rates, jobs data surprises, and what it means for your trades this week. Swipe for the breakdown 👉',
      media_type: 'CAROUSEL_ALBUM',
      media_url: '/mock/post9.jpg',
      timestamp: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock9',
    },
    {
      id: '10',
      caption: 'Trading psychology 101: How to recover from a losing streak without revenge trading. Save this one. 🧠 #tradingmindset #discipline',
      media_type: 'IMAGE',
      media_url: '/mock/post10.jpg',
      timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock10',
    },
    {
      id: '11',
      caption: 'Live Q&A this Friday at 7pm EST. Drop your questions below and I\'ll answer them on stream. See you there! 🔴 #livetrading #qa',
      media_type: 'VIDEO',
      media_url: '/mock/post11.jpg',
      thumbnail_url: '/mock/post11-thumb.jpg',
      timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock11',
    },
    {
      id: '12',
      caption: 'Your edge isn\'t a strategy. It\'s your ability to execute a strategy consistently, even when it\'s boring. That\'s where the money is. 💰',
      media_type: 'IMAGE',
      media_url: '/mock/post12.jpg',
      timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      permalink: 'https://instagram.com/p/mock12',
    },
  ];
}

export function getMockPostInsights(): (InstagramPost & PostInsights)[] {
  const posts = getMockPosts();
  return posts.map((post, i) => ({
    ...post,
    impressions: 12000 + Math.floor(Math.random() * 8000) - i * 200,
    reach: 8000 + Math.floor(Math.random() * 5000) - i * 150,
    engagement: 400 + Math.floor(Math.random() * 600) - i * 20,
    saved: 80 + Math.floor(Math.random() * 120) - i * 5,
    shares: 30 + Math.floor(Math.random() * 70) - i * 2,
    likes: 300 + Math.floor(Math.random() * 500) - i * 15,
    comments: 15 + Math.floor(Math.random() * 40) - i * 1,
  }));
}
