import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form/Form";
import Home from "./components/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/Home" element={<Home />} /> 
      </Routes>
    </Router>
  );
}

export default App;
