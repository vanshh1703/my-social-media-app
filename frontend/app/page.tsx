"use client";

import React, { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostItem, { PostType } from "../components/PostItem";
import { Bell, Search, Menu, Home as HomeIcon, User as UserIcon } from "lucide-react";

const INITIAL_POSTS: PostType[] = [
  {
    id: "1",
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      handle: "alexj"
    },
    content: "Just finished building my new portfolio site! What do you guys think? 🚀",
    likes: 42,
    comments: [
      {
        id: "c1",
        author: "Sarah Smith",
        content: "Looks absolutely amazing! Love the design.",
        createdAt: "2h ago"
      }
    ],
    createdAt: "3h ago"
  },
  {
    id: "2",
    author: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      handle: "mchen_dev"
    },
    content: "Beautiful sunset at the beach today. Taking a break from coding! 🌅",
    mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    mediaType: "image",
    likes: 128,
    comments: [],
    createdAt: "5h ago"
  }
];

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>(INITIAL_POSTS);

  const handlePostCreated = (content: string, mediaFile?: File | null) => {
    let mediaUrl = undefined;
    let mediaType: 'image' | 'video' | undefined = undefined;

    if (mediaFile) {
      mediaUrl = URL.createObjectURL(mediaFile);
      mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
    }

    const newPost: PostType = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        avatar: "",
        handle: "currentuser"
      },
      content,
      mediaUrl,
      mediaType,
      likes: 0,
      comments: [],
      createdAt: "Just now"
    };

    setPosts([newPost, ...posts]);
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
              <button className="md:hidden text-gray-500 hover:text-indigo-600 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden md:flex w-8 h-8 rounded-full bg-indigo-100 items-center justify-center text-indigo-700 font-bold overflow-hidden border-2 border-indigo-200 cursor-pointer">
                U
              </div>
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
              <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  U
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">Current User</h2>
                  <p className="text-sm text-gray-500">@currentuser</p>
                </div>
              </div>

              <nav className="space-y-1">
                <a href="#" className="flex items-center space-x-3 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg font-medium">
                  <HomeIcon className="h-5 w-5" />
                  <span>Feed</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded-lg font-medium transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Center Feed */}
          <div className="col-span-1 md:col-span-8 lg:col-span-6 w-full">
            <CreatePost onPostCreated={handlePostCreated} />

            <div className="space-y-0">
              {posts.map(post => (
                <PostItem key={post.id} post={post} />
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
