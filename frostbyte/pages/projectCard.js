import React from "react";
import "../pages/index.js";
export default function App(props) {
  return (
    <div>
      <div className='text-2xl text-center bg-yellow-100'>
        <h3>{props.children[1]}</h3>
        <h1>{props.children[3]}</h1>
      </div>
      <div></div>
    </div>
  );
}
