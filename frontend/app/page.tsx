"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreatePost from "../components/CreatePost";
import PostItem, { PostType } from "../components/PostItem";
import { Bell, Search, Menu, Home as HomeIcon, User as UserIcon, LogOut } from "lucide-react";

// API base URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: number, username: string, profile_picture: string | null } | null>(null);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/Login');
    } else {
      setIsAuthenticated(true);
      fetchUser(token);
      fetchPosts();
    }
  }, [router]);

  if (!isAuthenticated) return null; // Avoid flashing the home page before redirect

  const handlePostCreated = async (content: string, mediaFile?: File | null) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const formData = new FormData();
      if (content) formData.append('content', content);
      if (mediaFile) formData.append('image', mediaFile);

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
      } else {
        console.error("Failed to create post", await res.text());
      }
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/Login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
                SocialApp
              </span>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-colors sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <HomeIcon className="h-6 w-6" />
              </button>
              <button className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
              </button>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Logout">
                <LogOut className="h-6 w-6" />
              </button>
              <button className="md:hidden text-gray-500 hover:text-indigo-600 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
              {currentUser?.username ? (
                <Link href={`/profile/${currentUser.username}`}>
                  <div className="hidden md:flex w-8 h-8 rounded-full bg-indigo-100 items-center justify-center text-indigo-700 font-bold overflow-hidden border-2 border-indigo-200 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all">
                    {currentUser.profile_picture ? (
                      <img src={`${API_URL}${currentUser.profile_picture}`} alt={currentUser.username} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.username.charAt(0).toUpperCase()
                    )}
                  </div>
                </Link>
              ) : (
                <div className="hidden md:flex w-8 h-8 rounded-full bg-gray-200 items-center justify-center text-gray-500 font-bold overflow-hidden border-2 border-gray-300">
                  U
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 w-full transition-all">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

          {/* Left Sidebar - Hidden on small screens */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              {currentUser?.username ? (
                <Link href={`/profile/${currentUser.username}`}>
                  <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg overflow-hidden">
                      {currentUser.profile_picture ? (
                        <img src={`${API_URL}${currentUser.profile_picture}`} alt={currentUser.username} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">{currentUser.username}</h2>
                      <p className="text-sm text-gray-500">@{currentUser.username}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg overflow-hidden">
                    U
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Loading...</h2>
                    <p className="text-sm text-gray-500">@user</p>
                  </div>
                </div>
              )}

              <nav className="space-y-1">
                <Link href="/" className="flex items-center space-x-3 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg font-medium">
                  <HomeIcon className="h-5 w-5" />
                  <span>Feed</span>
                </Link>
                {currentUser?.username && (
                  <Link href={`/profile/${currentUser.username}`} className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded-lg font-medium transition-colors">
                    <UserIcon className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400 px-3 py-2 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Center Feed */}
          <div className="col-span-1 md:col-span-8 lg:col-span-6 w-full">
            <CreatePost onPostCreated={handlePostCreated} currentUser={currentUser} />

            <div className="space-y-0">
              {posts.map(post => (
                <PostItem key={post.id} post={post} currentUser={currentUser} />
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 text-lg">No posts yet. Be the first to post!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Trending/Suggestions */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 px-2">Trending</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="px-2 py-1 cursor-pointer group">
                    <p className="text-xs text-gray-500 mb-1">Trending in Tech</p>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">#NextJS15</p>
                    <p className="text-xs text-gray-500 mt-1">12.5K posts</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
