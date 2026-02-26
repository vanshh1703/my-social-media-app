import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export interface CommentType {
    id: string;
    author: string;
    content: string;
    createdAt: string;
}

export interface PostType {
    id: string;
    author: {
        name: string;
        avatar: string;
        handle: string;
    };
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    likes: number;
    comments: CommentType[];
    createdAt: string;
}

interface PostItemProps {
    post: PostType;
}

export default function PostItem({ post }: PostItemProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentType[]>(post.comments);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const commentItem: CommentType = {
            id: Date.now().toString(),
            author: 'Current User',
            content: newComment,
            createdAt: 'Just now'
        };

        setComments([...comments, commentItem]);
        setNewComment('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                        {post.author.avatar ? (
                            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                        ) : (
                            post.author.name.charAt(0)
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.author.name}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                            <span>@{post.author.handle}</span>
                            <span className="mx-1">•</span>
                            <span>{post.createdAt}</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Media Content */}
            {post.mediaUrl && (
                <div className="bg-gray-100 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-700">
                    {post.mediaType === 'video' ? (
                        <video src={post.mediaUrl} controls className="w-full max-h-[500px] object-contain" />
                    ) : (
                        <img src={post.mediaUrl} alt="Post media" className="w-full max-h-[500px] object-cover" />
                    )}
                </div>
            )}

            {/* Action Stats */}
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between text-sm text-gray-500">
                <span>{likesCount} Likes</span>
                <span>{comments.length} Comments</span>
            </div>

            {/* Action Buttons */}
            <div className="flex px-2 py-1">
                <button
                    onClick={handleLike}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors m-1
            ${isLiked
                            ? 'text-red-500 bg-red-50 dark:bg-red-500/10'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    <Heart size={20} className={isLiked ? "fill-current" : ""} />
                    <span className="font-medium">Like</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors m-1"
                >
                    <MessageCircle size={20} />
                    <span className="font-medium">Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors m-1">
                    <Share2 size={20} />
                    <span className="font-medium">Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                    <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 shrink-0 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            U
                        </div>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </form>

                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 flex items-center justify-center text-gray-600 font-bold text-xs mt-1">
                                    {comment.author.charAt(0)}
                                </div>
                                <div className="flex-1 bg-white dark:bg-gray-700/50 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100">{comment.author}</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
