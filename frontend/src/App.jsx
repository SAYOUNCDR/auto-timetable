import { useState } from "react";
import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Navbar from "./components/ui/Navbar";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <div className="min-h-screen max-w-5xl mx-auto flex items-center flex-col py-5 text-black pt-20">
        <Landing />
      </div>
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;
