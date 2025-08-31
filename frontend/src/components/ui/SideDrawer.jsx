import React, { useState, useEffect } from 'react';
import { IoSearch, IoCaretDown } from 'react-icons/io5';
import { IoIosNotifications } from 'react-icons/io';
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import Drawer from '../ui/Drawer';
import ProfileModal from '../modals/ProfileModal';
import appLogo from '../../assets/appLogo.png';


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();

  // New useEffect to fetch notifications on initial load
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await API.get('/message/unread', config);
        setNotification(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [user]);

  const handleSearch = async () => {
    if (!search.trim()) {
      setIsDrawerOpen(false); // Close drawer if search input is empty
      setSearchResult([]);
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await API.get(`/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log("error in searching ", error);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await API.post('/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error accessing chat:", error);
      setLoadingChat(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    // Close notifications menu when opening profile menu
    setShowNotificationsMenu(false); 
  };

  const handleNotificationsClick = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
    // Close profile menu when opening notifications menu
    setShowProfileMenu(false);
  };
  
  const handleNotificationClick = (notif) => {
    setSelectedChat(notif.chat);
    // Filter the notification by the unique chat ID
    setNotification(notification.filter((n) => n.chat._id !== notif.chat._id));
    setShowNotificationsMenu(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-center bg-white px-4 py-3 shadow-md lg:px-6">
        
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img src={appLogo} alt="G-CHAT App Logo" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <div className="relative flex-grow max-w-xs">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onClick={() => setIsDrawerOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full rounded-md border border-gray-300 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-blue-500 transition-colors"
            >
              <IoSearch size={20} />
            </button>
          </div>
        </div>

        {/* Center Section: App Title */}
        <div className="flex justify-center md:flex">
          <h1 className="text-xl font-bold text-purple-600 md:text-2xl whitespace-nowrap">
            G_CHAT
          </h1>
        </div>

        {/* Right Section: Icons and Profile Menu */}
        <div className="relative flex items-center justify-end space-x-4">
          
          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              className="rounded-full p-2 text-blue-500 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none"
              onClick={handleNotificationsClick}
              aria-label="Notifications"
            >
              <IoIosNotifications size={24} />
              {notification && notification.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {notification.length}
                </span>
              )}
            </button>
            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-2">
                  {notification && notification.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">No new messages</div>
                  ) : (
                    notification.map((notif, idx) => (
                      <button
                        key={notif._id || idx}
                        onClick={() => handleNotificationClick(notif)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {notif.chat.isGroupChat
                          ? `New message in ${notif.chat.chatName}`
                          : `New message from ${notif.sender.name}`}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Icon/Image with Dropdown */}
          <div className="relative">
            <button
              className="rounded-full p-0 transition-colors flex items-center gap-1 focus:outline-none"
              onClick={handleProfileClick}
            >
              {user?.pic ? (
                <img
                  src={user.pic}
                  alt={user?.name || 'User Profile'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                </div>
              )}
              <IoCaretDown size={16} className={`transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Component */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        searchResult={searchResult}
        loading={loading}
        handleAccessChat={accessChat}
      />

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
};

export default SideDrawer;
