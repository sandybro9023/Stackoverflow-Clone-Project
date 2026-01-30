import React, { useState } from 'react';
import axiosInstance from '../../lib/axiosinstance';
import { FaImage } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';

const UploadPost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const userFriendCount = user?.friends?.length || 0;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('media', file);
    formData.append('caption', caption);

    try {
      const response = await axiosInstance.post('/public/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      setCaption('');
      if (onPostCreated) onPostCreated(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded border border-gray-200 shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-4 text-[#232629]">Create a Post</h2>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0a95ff] transition text-sm text-[#3b4045]"
            placeholder="What would you like to share?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative overflow-hidden inline-block">
            <button type="button" className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium flex items-center transition">
              <FaImage className="mr-2 text-gray-500" />
              {file ? file.name.substring(0, 15) + (file.name.length > 15 ? '...' : '') : "Add Image/Video"}
            </button>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-gray-500">
              Friend Limit: <strong className="text-gray-700">{userFriendCount}</strong>
            </span>
            <button
              type="submit"
              disabled={uploading}
              className={`bg-[#0a95ff] text-white px-5 py-2 rounded text-sm hover:bg-[#0074cc] transition font-medium shadow-sm border border-transparent ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadPost;
