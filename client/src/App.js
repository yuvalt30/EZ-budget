import React, { useState, useEffect } from "react";
import Axios from 'axios'
import './App.css';
import axios from "axios";

function App() {

  const [instName, setInstName] = useState("")
  const [CFOName, setCFOName] = useState("")
  const [amount, setAmount] = useState(0)
  const [budgetList, setBudgetList] = useState([])
  const [newAmount, setNewAmount] = useState(0)
  useEffect(()=>{
    axios.get("http://localhost:3001/read").then((response => { 
      // console.log(response)
      setBudgetList(response.data)
    }))
  }, [])

  const addToList = ()=>{
    // console.log(instName + CFOName + amount)
    Axios.post("http://localhost:3001/insert", {
      instName: instName,
      CFOName: CFOName,
      amount: amount,
    });
  };

  const updateAmount = (id)=>{
    axios.put("http://localhost:3001/update", {id: id, newAmount: amount})
  }

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
      <h1>List:</h1>
      {budgetList.map((val, key) => {
        return <div key={key}>
          <h1>{val.instName}, {val.instCFO}, {val.amount}</h1>
          <input
            type="number"
            placeholder="New Amount"
            onChange={(event)=>{
              setAmount(event.target.value)
            }}
          />
          <button onClick={()=>updateAmount(val._id)}>Update Amount</button>
          <button>Delete</button>
          </div>
      })}
    </div>
  );
}

export default App;
