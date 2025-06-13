import { useState } from "react";
import "./App.css"
import AuthForm from "./component/form";
import Home from "./component/home";
import Search from "./component/search";
const App = () =>{
  const [Theme,setTheme] = useState(false);
  return <>
  <AuthForm Theme ={Theme} setTheme ={setTheme}/>
  <Home Theme ={Theme} setTheme ={setTheme}/>
  <Search Theme ={Theme} setTheme ={setTheme}/>
  </>
}
export default App;
