import { useEffect, useRef, useState } from 'react';
import { IoArrowBackOutline, IoHappyOutline, IoInformationCircleOutline, IoPeople, IoPerson, IoSend } from 'react-icons/io5';
import API from '../../api/api';
import { getSender, getSenderFull, isLastMessage, isSameSender } from '../../config/ChatLogic';
import { ChatState } from '../../context/ChatProvider';
import ChatInfoModal from '../modals/ChatInfoModal';

import io from 'socket.io-client';
const ENDPOINT = "http://localhost:5100";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);


  const handleInfoClick = () => setIsInfoModalOpen(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await API.get(`/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error in fetching messages:", error);
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (newMessage.trim() === "") return;
    if (event.key === "Enter" || event.type === 'click') {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageToSend = newMessage;
        setNewMessage("");
        const { data } = await API.post(
          "/message",
          { content: messageToSend, chatId: selectedChat._id },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 2000);
  };

  const handleEmojiClick = () => setNewMessage(prev => prev + '😊');

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const seconds = Math.floor((now - messageTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return messageTime.toLocaleDateString();
  };

  useEffect(() => {
    if (!socket) return;
    fetchMessages();
    
    const messageHandler = (newMessageRecieved) => {
      if (selectedChat && selectedChat._id === newMessageRecieved.chat._id) {
        setMessages(prevMessages => [...prevMessages, newMessageRecieved]);
      } else {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
    };
    socket.on("message recieved", messageHandler);

    return () => {
      socket.off("message recieved", messageHandler);
    };
  }, [selectedChat, fetchAgain]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen min-h-0 w-full">
      {selectedChat ? (
        <>
          {/* Header (sticky) */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white shadow-md">
            <button
              onClick={() => setSelectedChat("")}
              className="md:hidden p-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <IoArrowBackOutline size={24} />
            </button>
            <div className="flex items-center space-x-3">
              {selectedChat.isGroupChat ? (
                selectedChat.groupChatPicture ? (
                  <img src={selectedChat.groupChatPicture} alt={selectedChat.chatName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <IoPeople size={24} />
                  </div>
                )
              ) : (
                getSenderFull(user, selectedChat.users).pic ? (
                  <img src={getSenderFull(user, selectedChat.users).pic} alt={getSenderFull(user, selectedChat.users).name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <IoPerson size={24} />
                  </div>
                )
              )}
              <h3 className="text-lg font-semibold">
                {!selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName}
              </h3>
            </div>
            <button onClick={handleInfoClick} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <IoInformationCircleOutline size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Messages (scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div
                      key={message._id}
                      className={`flex items-end space-x-2 ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                      
                      {message.sender._id !== user._id && (isLastMessage(messages, index, user._id) || isSameSender(messages, message, index, user._id)) ? (
                        message.sender.pic ? (
                          <img src={message.sender.pic} alt={message.sender.name} className="w-8 h-8 rounded-full object-cover self-end" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white self-end">
                            <IoPerson size={18} />
                          </div>
                        )
                      ) : (
                        <div className="w-8 h-8 self-end" />
                      )}
                      
                      <div
                        className={`max-w-xs p-3 rounded-lg shadow-md flex flex-col ${
                          message.sender._id === user._id
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-violet-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {selectedChat.isGroupChat && message.sender._id !== user._id && (
                            <span className="text-xs text-gray-400 mb-1">{message.sender.name}</span>
                        )}
                        <p className="flex-1 whitespace-pre-wrap">{message.content}</p>
                        <span className={`text-xs ml-2 whitespace-nowrap mt-1 ${message.sender._id === user._id ? 'text-blue-200' : 'text-gray-500'}`}>
                          {formatTimeAgo(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>Start a conversation...</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          
          {isTyping && (
            <div className="p-2 ml-4 self-start text-sm text-gray-500">
              <div className="typing-indicator flex items-center space-x-1">
                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse-slow">typing .</span>
                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse-slow animation-delay-200"></span>
                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse-slow animation-delay-400"></span>
              </div>
            </div>
          )}
          <style>{`
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
            .animate-pulse-slow {
              animation: pulse-slow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .animation-delay-200 { animation-delay: 200ms; }
            .animation-delay-400 { animation-delay: 400ms; }
          `}</style>
          <div className="sticky bottom-0 z-10 p-4 bg-white-300 shadow-md ">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEmojiClick}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <IoHappyOutline size={24} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                onKeyDown={sendMessage}
                onChange={typingHandler}
                value={newMessage}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <IoSend size={24} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-gray-100 p-8 rounded-lg shadow-inner">
          <div className="text-4xl font-extrabold text-blue-600 mb-4">G_CHAT</div>
          <p className="text-xl font-semibold">Click on a user to start chatting</p>
        </div>
      )}

      {isInfoModalOpen && (
        <ChatInfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SingleChat;
