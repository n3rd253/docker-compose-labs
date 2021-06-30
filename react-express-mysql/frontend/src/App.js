import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {

  const [initializeMessage, setInitializeMessage] = useState();
  const [createrowmessage, createRowMessage] = useState();
  const [lastrowvalue, lastRowValue] = useState();

  function InitializeDB() {        
    fetch("/api/initializeDb/")
      .then(() => setInitializeMessage("DB Now initialized successfully!"))
      .catch(console.error);
  }

  function SetNewRow() {
    fetch("/api/createRow/")
      .then(() => createRowMessage("New row created in DB!  Click below to see what was added!"))
      .catch(console.error);
  }

  function GetLastRow() {
    fetch("/api/getLastRow/")
      .then(res => res.json())
      .then(res => lastRowValue(res.message))
      .catch(console.error);
  }

  const [message, setMessage] = useState();
  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(res => setMessage(res.message))
      .catch(console.error);
  }, [setMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message || "Loading..."}</p>

        <p>{initializeMessage || "DB Not yet initialized.  Click below to begin"}</p>
        <button onClick={() => InitializeDB()}>Initialize DB</button>

        <p>{createrowmessage || "Click below to create a new row in the db!"}</p>
        <button onClick={() => SetNewRow()}>Add row to DB</button>

        <p>{lastrowvalue || "After creating a row, click below to see what was created!"}</p>
        <button onClick={() => GetLastRow()}>Retrieve last row from DB</button>
      </header>
    </div>
  );
}

export default App;
