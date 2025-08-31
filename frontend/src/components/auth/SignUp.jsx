import { useState } from 'react';
import API from '../../api/api';
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ onSwitchView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // form submission
  const [imageLoading, setImageLoading] = useState(false); // image upload
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setImageLoading(true);
    if (!pics) {
      alert("Please Select an Image");
      setImageLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatApp"); // your unsigned preset
      data.append("cloud_name", "de3yjuuu1");

      fetch("https://api.cloudinary.com/v1_1/de3yjuuu1/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log("Uploaded:", data.url.toString());
          setImageLoading(false);
        })
        .catch((err) => {
          console.error("Upload Error:", err);
          setImageLoading(false);
        });
    } else {
      alert("Please Select a JPEG or PNG Image");
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      setLoading(false);
      return;
    }

    const formData = { name, email, password, confirmPassword, pic };

    try {
      const { data } = await API.post("/user", formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Profile Picture */}
        <div className="mb-6">
          <label htmlFor="profilePicture" className="block text-gray-700 font-medium mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            onChange={(e) => postDetails(e.target.files[0])}
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imageLoading && <p className="text-blue-600 mt-2">Uploading image...</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || imageLoading} // disabled while form or image loading
          className={`w-full py-3 text-white font-semibold rounded-lg transition-colors duration-300 ${
            loading || imageLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center mt-4">
        <button
          onClick={() => onSwitchView(true)}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
