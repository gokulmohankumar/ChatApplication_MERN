import { ChatState } from '../../context/ChatProvider';
import Singlechat from './Singlechat';
const ChatBox = ({fetchAgain,setFetchAgain,className}) => {
  const {user,selectedChat}=ChatState();
  return (
    <div className={`${className}flex flex-col min-h-0`}>
      <Singlechat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox
