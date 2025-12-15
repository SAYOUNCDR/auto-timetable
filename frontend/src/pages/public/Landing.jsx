import Hero from "../../components/ui/Hero";
import CompanyBanner from "../../components/ui/CompanyBanner";
import Features from "../../components/ui/Features";
import Navbar from "../../components/ui/Navbar"
import Footer from "../../components/ui/Footer";
import Login from "../../pages/public/Login";
import { useState } from "react";

const Landing = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <div className="w-full">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <Hero />
      <CompanyBanner />
      <Features />
      <Footer />
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default Landing;
