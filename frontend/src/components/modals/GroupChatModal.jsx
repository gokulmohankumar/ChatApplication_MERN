import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import API from '../../api/api';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../ui/UserBadgeItem';
import UserListItem from '../ui/UserListItem';

const GroupChatModal = ({ isOpen, onClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await API.get(`/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setError("Failed to load search results.");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName) {
      setError("Please enter the group name");
      return;
    }
    if (selectedUsers.length < 2) {
      setError("Need atleast 2 peoples to create a group");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await API.post(
        `/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
    } catch (error) {
      setError("Failed to create group chat.");
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      setError("User already added.");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setError("");
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl p-6 w-[90%] sm:w-[500px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoCloseOutline size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Create Group Chat
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Add Users (e.g., John, Jane)"
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selected Users */}
        <div className="flex flex-wrap my-2">
          {selectedUsers.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              handleFunction={() => handleDelete(u)}
            />
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-4 max-h-[200px] overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleGroup(user)}
              />
            ))
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupChatModal;
