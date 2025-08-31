import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const Drawer = ({ isOpen, onClose, searchResult, loading, handleAccessChat }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-16 left-4 w-full md:w-96 bg-white shadow-xl h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out transform z-50 rounded-lg flex flex-col">
          <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-semibold">Search results..</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <IoCloseOutline size={24} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-2 scrollable-content">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : searchResult.length > 0 ? (
              <ul className="space-y-2">
                {searchResult.map((user, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleAccessChat(user._id)}
                  >
                    {user?.pic ? (
                      <img
                        src={user.pic}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No users found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Drawer;
