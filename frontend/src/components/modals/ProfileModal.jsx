import React, { useState } from 'react';
import { IoClose, IoCloudUploadOutline } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { ChatState } from '../../context/ChatProvider';

const ProfileModal = ({ onClose }) => {
  const { user, updateUserProfile } = ChatState();
  const [name, setName] = useState(user?.name || '');
  const [pic, setPic] = useState(user?.pic || '');
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    setMessage({ text: "Uploading image...", type: "info" });

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", "de3yjuuu1");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/de3yjuuu1/image/upload", {
          method: "post",
          body: data,
        });
        const uploadData = await res.json();
        setPic(uploadData.url.toString());
        setMessage({ text: "Image uploaded successfully!", type: "success" });
      } catch (err) {
        console.error("Upload Error:", err);
        setMessage({ text: "Image upload failed. Please try again.", type: "error" });
      } finally {
        setImageLoading(false);
      }
    } else {
      setMessage({ text: "Please select a JPEG or PNG image.", type: "error" });
      setImageLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    await updateUserProfile({ name, pic });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl p-8 transform scale-100 transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">User Profile</h2>

        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
            {pic ? (
              <img src={pic} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <FaUser size={64} />
              </div>
            )}
            <label htmlFor="profile-pic-upload" className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
              <IoCloudUploadOutline size={40} className="text-white" />
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/jpeg, image/png"
            />
          </div>
          
          <div className="text-center w-full max-w-md">
            <div className="flex items-center justify-center space-x-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-2xl font-bold text-center"
              />
            </div>
            <p className="text-gray-500 mt-1">{user?.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={`mt-6 p-3 rounded-lg text-center font-medium ${
            message.type === "error" ? "bg-red-100 text-red-700" :
            message.type === "success" ? "bg-green-100 text-green-700" :
            "bg-blue-100 text-blue-700"
          }`}>
            {message.text}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveChanges}
            disabled={imageLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full text-white font-semibold transition-colors ${
              imageLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {imageLoading && <IoCloudUploadOutline className="animate-spin" size={20} />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
