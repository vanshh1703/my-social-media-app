import React, { useState } from 'react';
import { Image as ImageIcon, Video, Send } from 'lucide-react';

interface CreatePostProps {
    onPostCreated: (content: string, mediaFile?: File | null) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !media) return;
        onPostCreated(content, media);
        setContent('');
        setMedia(null);
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMedia(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 shrink-0 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                        U
                    </div>
                    <textarea
                        className="w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg p-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500 transition-all border border-transparent focus:border-indigo-500"
                        rows={3}
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {media && (
                    <div className="mb-4 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 flex items-center justify-center p-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-full">
                            Attached: {media.name}
                        </span>
                        <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                            onClick={() => setMedia(null)}
                        >
                            &times;
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                            <ImageIcon size={20} />
                            <span className="text-sm font-medium hidden sm:block">Photo</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleMediaChange} />
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                            <Video size={20} />
                            <span className="text-sm font-medium hidden sm:block">Video</span>
                            <input type="file" accept="video/*" className="hidden" onChange={handleMediaChange} />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!content.trim() && !media}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-medium transition-all transform active:scale-95"
                    >
                        <span>Post</span>
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}
