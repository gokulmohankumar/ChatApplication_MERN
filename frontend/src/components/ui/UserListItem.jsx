import React from 'react';
import { FaUser } from 'react-icons/fa';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center space-x-3 p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
    >
      {user.pic ? (
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user.pic}
          alt={user.name}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
          <FaUser size={20} />
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;