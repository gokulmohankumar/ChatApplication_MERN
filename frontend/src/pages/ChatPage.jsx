import { useState } from 'react';
import ChatBox from '../components/chat/ChatBox';
import MyChats from '../components/chat/MyChats';
import SideDrawer from '../components/ui/SideDrawer';
import { ChatState } from '../context/ChatProvider';

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const { selectedChat } = ChatState();

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans text-gray-800">
      <SideDrawer />
      {/* Spacer to push content below the fixed SideDrawer. Adjust height as needed. */}
      <div className="h-16"></div> 
      <div className="flex flex-1 p-3 space-x-3 overflow-hidden">
        {user && (
          <MyChats
            fetchAgain={fetchAgain}
            className={`${selectedChat ? 'hidden' : 'flex'} md:flex`}
          />
        )}
        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            className={`${selectedChat ? 'flex' : 'hidden'} flex-1 md:flex`}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;