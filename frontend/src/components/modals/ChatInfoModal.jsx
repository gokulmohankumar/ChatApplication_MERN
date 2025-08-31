import { useState } from 'react';
import { IoCloseOutline, IoPencil, IoPerson } from 'react-icons/io5';
import API from '../../api/api';
import { getSenderFull } from '../../config/ChatLogic';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../ui/UserBadgeItem';
import UserListItem from '../ui/UserListItem';

const ChatInfoModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const isUserAdmin = selectedChat.isGroupChat && selectedChat.groupAdmin._id === user._id;

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await API.get(`/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error("Failed to load search results", error);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupName) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await API.put(
        '/chat/rename',
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        config
      );
      setSelectedChat(data);
      setLoading(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to rename group chat", error);
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      console.error("User already in the group.");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      console.error("Only admins can add members.");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await API.put(
        '/chat/groupadd',
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to add user to group", error);
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      console.error("Only admins can remove other members.");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await API.put(
        '/chat/groupremove',
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      setSelectedChat(data);
      if (userToRemove._id === user._id) {
        setSelectedChat('');
        setChats(chats.filter((chat) => chat._id !== selectedChat._id));
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to remove user from group", error);
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const otherUser = selectedChat.isGroupChat ? null : getSenderFull(user, selectedChat.users);

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-[1000]"
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

        <div className="flex flex-col items-center justify-center space-y-4">
          {selectedChat.isGroupChat ? (
            <>
              <div className="flex items-center space-x-3 w-full">
                <h2 className="text-2xl font-bold text-center text-blue-600">
                  {isEditing ? (
                    <input
                      type="text"
                      value={groupName || selectedChat.chatName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    selectedChat.chatName
                  )}
                </h2>
                {isUserAdmin && (
                  <button onClick={() => setIsEditing(!isEditing)} className="p-1 rounded-full hover:bg-gray-100">
                    <IoPencil size={18} className="text-gray-600" />
                  </button>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={handleRename}
                  className="w-full mt-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
                >
                  {loading ? 'Renaming...' : 'Update Name'}
                </button>
              )}

              <div className="flex flex-wrap gap-2 my-2 w-full">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => isUserAdmin && u._id !== user._id && handleRemoveUser(u)}
                  />
                ))}
              </div>

              {isUserAdmin && (
                <>
                  <h3 className="text-lg font-semibold w-full">Add Users</h3>
                  <input
                    type="text"
                    placeholder="Search for users"
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-4 max-h-[150px] overflow-y-auto w-full">
                    {loading ? (
                      <div className="text-center text-gray-500">Loading...</div>
                    ) : (
                      searchResult?.map((u) => (
                        <UserListItem
                          key={u._id}
                          user={u}
                          handleFunction={() => handleAddUser(u)}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
              <button
                onClick={() => handleRemoveUser(user)}
                className="w-full mt-6 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
              >
                Leave Group
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-200">
                {otherUser?.pic ? (
                  <img src={otherUser.pic} alt={otherUser.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <IoPerson size={50} className="text-gray-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-center text-blue-600">{otherUser?.name}</h2>
              <p className="text-gray-500">{otherUser?.email}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInfoModal;
