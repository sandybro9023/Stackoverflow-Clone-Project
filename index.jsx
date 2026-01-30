import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/router';
import axiosInstance from '../../lib/axiosinstance';
import UploadPost from '../../components/PublicSpace/UploadPost';
import PostCard from '../../components/PublicSpace/PostCard';
import FriendList from '../../components/PublicSpace/FriendList';
import Mainlayout from '../../layout/Mainlayout';

const PublicSpace = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/public/feed');
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (!mounted || authLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const RightSidebarContent = (
    <div className="w-72 lg:w-80 p-4 lg:p-6 bg-gray-50 min-h-screen border-l border-gray-200">
      <FriendList currentUser={user} />

      <div className="mt-6 bg-white border border-gray-200 rounded p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">Posting Rules</h3>
        <ul className="space-y-2 text-xs lg:text-sm text-gray-700">
          <li className="flex items-start"><span className="mr-2">•</span>0 Friends: Cannot post</li>
          <li className="flex items-start"><span className="mr-2">•</span>1 Friend: 1 post/day</li>
          <li className="flex items-start"><span className="mr-2">•</span>2 Friends: 2 posts/day</li>
          <li className="flex items-start"><span className="mr-2">•</span>&gt;10 Friends: Unlimited</li>
          <li className="flex items-start"><span className="mr-2">•</span>Others: 2 posts/day</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Mainlayout rightSidebar={RightSidebarContent}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Public Space</h1>

        <UploadPost
          onPostCreated={handlePostCreated}
        />

        <div className="space-y-6">
          {loadingPosts ? (
            <p className="text-center text-gray-500">Loading feed...</p>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post._id} post={post} currentUser={user} />
            ))
          ) : (
            <p className="text-center text-gray-500">No posts yet. Be the first to share!</p>
          )}
        </div>
      </div>
    </Mainlayout>
  );
};

export default PublicSpace;
