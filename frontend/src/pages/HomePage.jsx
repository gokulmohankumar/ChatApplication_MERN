import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/Login';
import SignUpForm from '../components/auth/SignUp';
const HomePage = () => {

  const navigate=useNavigate()
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"))
    if(user) navigate("/chat")
  },[navigate])
  const [isLoginView, setIsLoginView] = useState(true);
   
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-12 lg:p-16 items-center justify-center">
      
      {/* Introduction Section */}
      <div className="lg:w-1/2 p-6 md:p-12 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Fast, Efficient and Productive
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Connect with friends and family in real-time. Share moments, ideas, and everything in between.
        </p>
      </div>

      {/* Authentication Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0">
        <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-xl shadow-2xl relative overflow-hidden transition-all duration-500">
          
          {/* Tabs for Login and Sign Up */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsLoginView(true)}
              className={`py-2 px-6 rounded-t-lg font-semibold text-lg ${isLoginView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`py-2 px-6 rounded-t-lg font-semibold text-lg ${!isLoginView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>

          {isLoginView ? (
            <LoginForm  />
          ) : (
            <SignUpForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;