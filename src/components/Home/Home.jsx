import React from "react";
import "./Home.css";
import Users from "../Users/Users";

export default function Home() {
  return (
    <>
    <div className="container-Home">
      <h1>خوش اومدی به صفحه Home 🏠</h1>
      <Users/>
    </div>
    </>
  );
}
