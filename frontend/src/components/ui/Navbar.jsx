import { useState } from "react";
import { Button } from "./Button";
import CalanderSVG from "../Logos/CalanderSVG";

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/20">
      <div className="max-w-full px-25 py-3 flex items-center justify-between">
        <div className="text-black text-2xl font-semibold tracking-wide flex flex-row items-center gap-2">
          <CalanderSVG />
          Auto Gen
        </div>
        <Button onClick={onLoginClick} className="mt-3">
          {" "}
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
