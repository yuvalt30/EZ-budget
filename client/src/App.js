import React, { useState } from "react";
import Axios from 'axios'
import './App.css';

function App() {

  const [instName, setInstName] = useState("")
  const [CFOName, setCFOName] = useState("")
  const [amount, setAmount] = useState(0)

  const addToList = ()=>{
    // console.log(instName + CFOName + amount)
    Axios.post("http://localhost:3001/insert", {
      instName: instName,
      CFOName: CFOName,
      amount: amount,
    });
  };

  return (
    <div className="App">
      <h1>CRUD app with MERN</h1>

      <label>Inst. Name:</label>
      <input 
        type="text"
        onChange={(event)=>{
          setInstName(event.target.value)
        }}
      />
      <label>Inst. CFO:</label>
      <input 
        type="text"
        onChange={(event)=>{
          setCFOName(event.target.value)
        }}
      />
      <label>Amount:</label>
      <input 
        type="number"
        onChange={(event)=>{
          setAmount(event.target.value)
        }}
      />
      <button onClick={addToList}>Add to DB</button>
      
    </div>
  );
}

export default App;
