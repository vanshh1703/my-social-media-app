import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PostItem, { PostType } from "../../../components/PostItem";
import { ArrowLeft, Calendar, User as UserIcon } from "lucide-react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface UserProfile {
    id: number;
    username: string;
    email: string;
    age: number | null;
    profile_picture: string | null;
    created_at: string;
    posts: PostType[];
}

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const profileUsername = params.username as string;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [currentUser, setCurrentUser] = useState<{ id: number, username: string, profile_picture: string | null } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCurrentUser = async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/users/${profileUsername}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            } else if (res.status === 404) {
                setError("User not found");
            } else {
                setError("Failed to load profile");
            }
        } catch (e) {
            setError("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCurrentUser(token);
        }
        if (profileUsername) {
            fetchProfile();
        }
    }, [profileUsername]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{error || "User not found"}</h1>
                <button
                    onClick={() => router.push('/')}
                    className="text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Feed
                </button>
            </div>
        );
    }

    const joinDate = new Date(profile.created_at).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors mr-4"
                    >
                        <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">{profile.username}</h1>
                        <p className="text-xs text-gray-500">{profile.posts.length} posts</p>
                    </div>
                </div>
            </nav>

            {/* Profile Header */}
            <main className="max-w-4xl mx-auto w-full transition-all">
                {/* Cover Photo / Background */}
                <div className="h-48 md:h-64 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" />

                <div className="px-4 sm:px-6 lg:px-8 relative pb-8">
                    {/* Avatar floating over banner */}
                    <div className="absolute -top-16 border-4 border-gray-50 dark:border-gray-900 rounded-full bg-white dark:bg-gray-800 w-32 h-32 flex items-center justify-center overflow-hidden">
                        {profile.profile_picture ? (
                            <img src={`${API_URL}${profile.profile_picture}`} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-16 h-16 text-gray-400" />
                        )}
                    </div>

                    {/* Action buttons area (empty right now but reserved space) */}
                    <div className="flex justify-end h-16 pt-4">
                        {currentUser?.username === profile.username && (
                            <button className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="mt-4">
                        <h2 className="text-2xl font-bold">{profile.username}</h2>
                        <p className="text-gray-500">@{profile.username}</p>
                    </div>

                    <div className="mt-4 flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                            <Calendar size={18} className="mr-2" />
                            Joined {joinDate}
                        </span>
                        {profile.age && (
                            <span className="flex items-center">
                                <UserIcon size={18} className="mr-2" />
                                {profile.age} years old
                            </span>
                        )}
                    </div>

                    {/* Feed Switcher Tabs */}
                    <div className="flex w-full mt-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="py-4 font-semibold text-indigo-600 border-b-2 border-indigo-600 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            Posts
                        </div>
                    </div>

                    {/* Profile Posts Feed */}
                    <div className="mt-6 max-w-2xl">
                        {profile.posts.length > 0 ? (
                            profile.posts.map(post => (
                                <PostItem key={post.id} post={post} currentUser={currentUser} />
                            ))
                        ) : (
                            <div className="text-center py-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <UserIcon size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No posts yet</h3>
                                <p className="text-gray-500 mt-2">@{profile.username} hasn't posted anything yet.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
