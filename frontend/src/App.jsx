import { useState } from "react";
import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <div className="min-h-screen max-w-7xl mx-auto flex items-center flex-col py-5 text-black pt-20">
        <Landing />
      </div>
      <Footer />
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;
