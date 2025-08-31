import React from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <span className="inline-flex items-center m-1 px-3 py-1 text-sm font-medium bg-purple-200 text-purple-800 rounded-full shadow-sm">
      {user.name}
      <button onClick={handleFunction} className="ml-2 text-purple-600 hover:text-purple-800 transition-colors focus:outline-none">
        <IoCloseCircleOutline size={16} />
      </button>
    </span>
  );
};

export default UserBadgeItem;
