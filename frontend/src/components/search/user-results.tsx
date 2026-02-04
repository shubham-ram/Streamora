import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  isLive: boolean;
}

interface UserResultsProps {
  users: UserData[];
}

export function UserResults({ users }: UserResultsProps) {
  if (users.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Users
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/user/${user.username}`}
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden relative">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {user.displayName || user.username}
              </h3>
              <p className="text-slate-400 text-sm truncate">
                @{user.username}
              </p>
            </div>
            {user.isLive && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                LIVE
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
