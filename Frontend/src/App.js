import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [data, setData] = useState([])

  useEffect(()=>{
    getData()
  }, [])

  const getData = async () => {
    const res = await axios.get("/storage");
    setData(res.data);
  }

  return (
    <div>
        a
        {data.files ? data.files.map((e)=><p>{e}</p>):<p>nada</p>}
    </div>
  );
}

export default App;
