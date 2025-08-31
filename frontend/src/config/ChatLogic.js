
export const getSender=(loggedUser,users)=>{
    return users[0]._id===loggedUser._id?users[1].name:users[0].name
}

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};


export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 || // Is it the last message in the chat?
    (messages[i + 1] && messages[i + 1].sender._id !== messages[i].sender._id)
  );
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};