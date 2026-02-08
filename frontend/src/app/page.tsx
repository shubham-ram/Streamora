import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  HeroSection,
  LiveStreamsSection,
  CategoriesSection,
  FollowingStreamsSection,
} from "@/components/home";

interface Stream {
  id: string;
  title: string;
  viewerCount: number;
  thumbnailUrl?: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    streamKey: string;
  };
  category?: {
    name: string;
  };
}

async function getLiveStreams(): Promise<Stream[]> {
  try {
    const res = await fetch("http://localhost:8000/api/streams", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const streams = await getLiveStreams();

  return (
    <div className="min-h-screen bg-page-bg">
      <Navbar />
      <HeroSection />
      <FollowingStreamsSection />
      <LiveStreamsSection streams={streams} />
      <CategoriesSection />
      <Footer />
    </div>
  );
}
