import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsSwapped }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = {
        email: email,
        username: username,
        password: password,
      };
      const { data } = await axios.post(
        "https://paperflock.onrender.com/api/users/signup",
        formdata
      );
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/documents");
    } catch (error) {
      if (error.response) {
        if (Array.isArray(error.response.data.error)) {
          // Handle array of errors
          const errors = error.response.data.error.map((err) => err.message);
          setErrorMessage(errors.join(", "));
        } else if (typeof error.response.data.message === "string") {
          // Handle single error message
          setErrorMessage(error.response.data.message);
        } else {
          // Handle other errors (network issues, etc.)
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-2 my-auto items-center w-full max-w-md mx-auto px-8 rounded-lg shadow-md">
      <h1 className="font-['Body'] tracking-tight text-4xl text-white">
        Create Account
      </h1>
      <h2 className="font-['Body'] tracking-tight text-xl text-white">
        Sign up for a new account
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-6 w-full"
        method="post"
      >
        <div className="flex flex-col gap-y-1">
          <label htmlFor="email" className="text-white text-sm">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="w-full border-gray-300 bg-white text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm rounded-md p-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="username" className="text-white text-sm">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="w-full border-gray-300 bg-white text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm rounded-md p-1.5"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="password" className="text-white text-sm">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full border-gray-300 bg-white text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm rounded-md p-1.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition-transform duration-300"
        >
          Sign Up
        </button>
      </form>
      <label
        className="text-[0.7rem] text-white cursor-pointer"
        onClick={() => setIsSwapped((prev) => !prev)}
      >
        Already registered? Log In
      </label>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
    </div>
  );
};

export default Signup;
