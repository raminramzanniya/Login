import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

export default function Form() {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const registerHandler = (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !email) {
      alert("لطفاً همه فیلدها رو پر کنید");
      return;
    }

    let userInfos = {
      firstName,
      lastName,
      email,
    };

    fetch("https://admin-p1-default-rtdb.firebaseio.com/users.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfos),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);

        setSuccess(true); 
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      <div className="form-container">
        {!success ? (
          <form
            className="register-form"
            autoComplete="off"
            onSubmit={registerHandler}
          >
            <h4 className="Title">First name</h4>
            <input
              id="first-name"
              value={firstName}
              onChange={(event) => setFirstname(event.target.value)}
              className="form-field"
              type="text"
              placeholder="Enter your First Name"
              name="firstName"
            />
            <h4 className="Title">Last name</h4>
            <input
              id="last-name"
              value={lastName}
              onChange={(event) => setLastname(event.target.value)}
              className="form-field"
              type="text"
              placeholder="Enter your Last Name"
              name="lastName"
            />
            <h4 className="Title">Email</h4>
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-field"
              type="email"
              placeholder="Enter your Email"
              name="email"
            />
            <button className="form-field" type="submit">
              Register
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h3>ثبت‌نام با موفقیت انجام شد 🎉</h3>
            <button
              className="form-field"
              onClick={() => navigate("/Home")}>
              ورود
            </button>
          </div>
        )}
      </div>
    </>
  );
}
