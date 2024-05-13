import axios from "axios"
import useAuth from "../context/AuthProvider";

export const loginLoader = async ()=>{
    try {
        const response = await axios.get('/getFamily');
        return response.data.family;
      } catch (err) {
        return [
            "Nicolas",
            "Paola",
            "Alejandro",
            "Agustin",
            ]
        //throw new Response("Fail Loading data", { status: 500 });
      }
}

export const storageLoader = async ({ request })=>{
  try {
      const response = await axios.get('/storage/files');
      return response.data;
    } catch (err) {
      throw new Response("Fail Loading data", { status: 500 });
    }
}