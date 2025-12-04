import React, { useState, useEffect } from 'react';
import { postService } from '../services/api'; 

const CATEGORY_PLACEHOLDER = 'Uncategorized'; 

// 1. Define the Backend URL specifically for images
const API_BASE_URL = 'https://deployment-and-devops-essentials-hcoh.onrender.com';

const PostCard = ({ post }) => {
  // 2. CRITICAL FIX: Use 'featuredImage' (This matches your MongoDB field)
  // We check 'featuredImage' first, but keep 'image' as a fallback just in case.
  const imagePath = post.featuredImage || post.image;

  // 3. Construct the full image URL using the fixed path
  const imageUrl = imagePath 
    ? `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath.replace('public/', '')}`
    : null;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02]">
      
      {/* 4. Display the Image (Only if we successfully found a URL) */}
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden bg-gray-200">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => { 
              // If the image fails to load (e.g. file deleted on server), hide the box
              e.target.style.display = 'none'; 
            }} 
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category?.name || post.category || CATEGORY_PLACEHOLDER} 
          </span>
          <span className="text-sm text-gray-500">
            {new Date(post.createdAt || Date.now()).toLocaleDateString()}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
          {post.title}
        </h2>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.content}
        </p>
        
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-600 font-medium">
            Author: {post.author?.username || post.author || 'Anonymous'} 
          </div>
          <button 
            onClick={() => console.log(`Reading post: ${post.title}`)} 
            className="text-indigo-600 hover:text-indigo-800 transition duration-150 text-sm font-semibold"
          >
            Read More &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getAllPosts();
      
      if (data.success && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]); 
      }
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-lg text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-xl mx-auto">
        <p className="text-red-700 font-medium mb-4">{error}</p>
        <button 
          onClick={fetchPosts} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center mx-auto transition duration-200"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg max-w-xl mx-auto">
        <p className="text-xl font-semibold text-yellow-800 mb-2">No Posts Found</p>
        <p className="text-yellow-700">The database is connected, but there are no blog posts yet.</p>
        <p className="text-sm text-yellow-600 mt-2">Create your first post to see it here!</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        {/* Updated Title for verification */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">The Starfleet Daily (LIVE v3)</h1>
        <p className="text-xl text-gray-600">Latest updates from across the quadrant.</p>
      </header>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post._id} post={post} /> 
        ))}
      </div>
    </div>
  );
};

export default PostList;