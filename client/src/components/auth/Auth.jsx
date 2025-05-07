import React from "react";
import "./Auth.css";

const Auth = () => {

  const hanleOnclick = () => {
    window.open("http://localhost:3000/api/auth/google", "_self");
  }

  return (
    <main className="auth-main">
      <section>
        <h1>Welcome to the AI Email Agent</h1>
        <p>Get your email work done by our Agent</p>
        <button onClick={hanleOnclick}>Continue with google <img src="https://cdn-icons-png.flaticon.com/128/2702/2702602.png" alt="" /></button>
      </section>
    </main>
  );
};

export default Auth;
