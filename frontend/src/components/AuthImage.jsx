import React from "react";

const AuthImage = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2">
      <img
        src="https://placehold.co/1080x1920/000000/FFF?text=Chatty"
        alt="Auth"
        className="object-cover w-full h-screen"
      />
    </div>
  );
};

export default AuthImage;
