import { useEffect, useState } from 'react';
import { IoAdd, IoPeople, IoPerson } from 'react-icons/io5';
import API from '../../api/api';
import { getSender } from '../../config/ChatLogic';
import { ChatState } from '../../context/ChatProvider';
import GroupChatModal from '../modals/GroupChatModal';

const MyChats = ({fetchAgain,className}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
  
  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await API.get("/chat", config);
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error in fetching user chats", error);
      setLoading(false);
    }
  };

  const getSenderPic = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    if (user) {
      fetchChats();
    }
  }, [fetchAgain]);

  return (
    <div className={`w-sm flex flex-col p-4 bg-white rounded-lg shadow-md h-full ${className}`}>
      <div className="flex justify-between items-center pb-3 px-3 flex-shrink-0">
        <h2 className="text-xl font-bold">My Chats</h2>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => setIsGroupChatModalOpen(true)}
        >
          <IoAdd />
          <p className="hidden md:block">Group Chat</p>
        </button>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <p className="text-center text-gray-500">Loading chats...</p>
        ) : chats && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedChat?._id === chat._id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {chat.isGroupChat ? (
                  chat.groupChatPicture ? (
                    <img
                      src={chat.groupChatPicture}
                      alt={chat.chatName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg">
                      <IoPeople size={24} />
                    </div>
                  )
                ) : (
                  loggedUser && getSenderPic(loggedUser, chat.users) ? (
                    <img
                      src={getSenderPic(loggedUser, chat.users)}
                      alt={getSender(loggedUser, chat.users)}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg">
                      <IoPerson size={24} />
                    </div>
                  )
                )}
                <div>
                  <p className="font-semibold">
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                  </p>
                  {chat.latestMessage && (
                    <p className="text-sm">
                      <b>{chat.latestMessage.sender._id === user._id ? "You" : chat.latestMessage.sender.name}: </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No chats found.</p>
        )}
      </div>
      <GroupChatModal isOpen={isGroupChatModalOpen} onClose={() => setIsGroupChatModalOpen(false)} />
    </div>
  );
};

export default MyChats;
