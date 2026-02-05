import Image from "next/image";
import { User, Calendar, Users, Eye } from "lucide-react";

interface ProfileHeaderProps {
  user: {
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
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-slate-950 relative">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.username}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-white" />
            )}
            {user.isLive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                  Live
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 pb-4">
            <h1 className="text-3xl font-bold text-white">
              {user.displayName || user.username}
            </h1>
            <p className="text-slate-400">@{user.username}</p>
          </div>

          {/* Follow Button - placeholder for now */}
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors">
            Follow
          </button>
        </div>

        {/* Bio & Stats */}
        <div className="mt-6 space-y-4">
          {user.bio && <p className="text-slate-300">{user.bio}</p>}

          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                <strong className="text-white">
                  {user._count?.followers || 0}
                </strong>{" "}
                followers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>
                <strong className="text-white">
                  {user._count?.following || 0}
                </strong>{" "}
                following
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
