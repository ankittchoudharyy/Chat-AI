import { useState } from 'react'
import './App.css'
import axios from 'axios';


function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("");

  async function generateAnswer(){
    setAnswer("Loading..")
    const response = await axios({
      url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC_mU22QDyEYKwlgXxEmSPCoSUCs37JR4M",
      method:"post",
      data:{
        contents :[
          { parts :[{ text :question}]},
        ],
      },
    });
    setAnswer (response['data']['candidates'][0]['content']['parts']['0']['text'])
  }

  return (
    <>
      <h1 className="bg-green-500">Chat AI</h1>
      <textarea
      className="border rounded w-full"
      value={question} onChange={(e)=> setQuestion(e.target.value)}cols="30" rows=""
      placeholder="Ask me anything"></textarea>
      <button onClick={generateAnswer}>Generate Answer</button>
      <pre>{answer}</pre>
    </>
  )
}

export default App
