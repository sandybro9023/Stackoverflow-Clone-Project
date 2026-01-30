import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosinstance';
import { FaUserPlus, FaUserFriends } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';

const FriendList = () => {
  const { user: currentUser, setUser } = useAuth();
  const [suggestionUsers, setSuggestionUsers] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/public/users');
      const allUsers = response.data;

      // Ensure IDs are strings for comparison
      const friendIds = (currentUser.friends || []).map(id => String(id));

      const notFriends = allUsers.filter(u => !friendIds.includes(String(u._id)));
      const friends = allUsers.filter(u => friendIds.includes(String(u._id)));

      setSuggestionUsers(notFriends);
      setMyFriends(friends);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await axiosInstance.put(`/public/add-friend/${userId}`);

      // Response logic: Backend returns the updated USER object for the current user
      const updatedUserData = response.data;

      if (updatedUserData && updatedUserData.friends) {
        // Construct new user state carefully preserving token if needed (though usually token is separate)
        const updatedUser = { ...currentUser, ...updatedUserData };

        // Update Global State
        if (setUser) {
          setUser(updatedUser);

          // Persist
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          const finalUser = { ...storedUser, ...updatedUserData }; // Merge in new data
          localStorage.setItem("user", JSON.stringify(finalUser));
        }

        // Optimistic UI Update: Move user from Suggestions to Friends locally
        const userToAdd = suggestionUsers.find(u => u._id === userId);
        if (userToAdd) {
          setSuggestionUsers(suggestionUsers.filter(u => u._id !== userId));
          setMyFriends([...myFriends, userToAdd]);
        }
      }

      alert("Friend added!");
    } catch (error) {
      console.error("Error adding friend", error);
      alert("Failed. Try again.");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 shadow-sm mb-6">
      <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base flex items-center">
        <FaUserFriends className="mr-2 text-blue-500" />
        Connect with People
      </h3>

      <div className="flex space-x-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`pb-2 text-xs font-medium ${activeTab === 'suggestions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Suggestions
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`pb-2 text-xs font-medium ${activeTab === 'friends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          My Friends ({myFriends.length})
        </button>
      </div>

      <div className="space-y-3">
        {activeTab === 'suggestions' ? (
          <>
            {suggestionUsers.slice(0, 5).map((user) => (
              <div key={user._id} className="flex justify-between items-center group">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold mr-2">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">{user.name}</span>
                </div>
                <button
                  onClick={() => handleAddFriend(user._id)}
                  className="text-gray-400 hover:text-blue-500 transition p-1"
                  title="Add Friend"
                >
                  <FaUserPlus />
                </button>
              </div>
            ))}
            {suggestionUsers.length === 0 && <p className="text-xs text-gray-400 italic">No new users.</p>}
          </>
        ) : (
          <>
            {myFriends.map((user) => (
              <div key={user._id} className="flex items-center group">
                <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold mr-2">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            ))}
            {myFriends.length === 0 && <p className="text-xs text-gray-400 italic">No friends yet.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendList;
