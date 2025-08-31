import React, { useState } from 'react';
import API from '../../api/api';
import { useNavigate } from "react-router-dom";
const LoginForm = ({ onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();

    const loginDetails = { email, password };
    if(!email || !password)
    {
      alert("Fill your details")
      return
    }
    try {
      const{data}=await API.post("/user/login",loginDetails)
      localStorage.removeItem("userInfo");
       localStorage.setItem('userInfo', JSON.stringify(data));
       navigate("/chat");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
    console.log("Login submitted:", loginDetails);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
        Welcome Back!
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Log in to your account
      </p>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-6">
          <label htmlFor="login-email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label htmlFor="login-password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Log In
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="text-center mt-4">
        <button
          onClick={() => onSwitchView(false)}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
