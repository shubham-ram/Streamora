import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProfileHeader, UserStreams } from "@/components/profile";

interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isLive: boolean;
  createdAt: string;
  _count?: {
    followers: number;
    following: number;
  };
  streams: Array<{
    id: string;
    title: string;
    viewerCount: number;
    startedAt: string;
    endedAt?: string;
    isLive: boolean;
    category?: { name: string; slug: string };
  }>;
}

async function getUser(username: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/user/${username}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <ProfileHeader user={user} />
      <UserStreams streams={user.streams} username={user.username} />
      <Footer />
    </div>
  );
}
