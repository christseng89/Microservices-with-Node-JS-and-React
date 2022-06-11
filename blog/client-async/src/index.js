import ReactDOM from "react-dom/client";
import App from "./App";
// require('dotenv').config()

const root = ReactDOM.createRoot(document.getElementById("root"));
const test = `${process.env.TEST}`
console.log('Node Env', process.env.NODE_ENV);
console.log('Test Env', test);
root.render(<App />);
