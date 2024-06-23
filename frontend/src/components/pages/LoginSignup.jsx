import React, { useState } from "react";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import auth from "../../assets/videos/auth.mp4";

const LoginSignupPage = () => {
  const [isSwapped, setIsSwapped] = useState(false);

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <div className="w-[90%] h-[90%] m-auto flex border border-bgcolor shadow-2xl">
          <div
            className={`flex-1 transition-transform duration-500 ${
              isSwapped ? "md:translate-x-full" : "md:translate-x-0"
            }`}
          >
            <div className="border w-full h-full flex flex-col justify-center items-center pt-4 text-white bg-bgcolor">
              {!isSwapped ? (
                <Login setIsSwapped={setIsSwapped} />
              ) : (
                <Signup setIsSwapped={setIsSwapped} />
              )}
            </div>
          </div>
          <div
            className={`flex-1 transition-transform duration-500  hidden md:block ${
              isSwapped ? "md:-translate-x-full" : "md:translate-x-0"
            }`}
          >
            <video
              src={auth}
              autoPlay
              loop
              muted
              className="h-full w-full object-contain xl:object-cover"
            ></video>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignupPage;
