import { Button } from "./Button";

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/20">
      <div className="max-w-full px-40 py-2 flex items-center justify-between">
        <div className="text-black text-lg font-bold tracking-wide">
          Auto Gen
        </div>
        <Button onClick={onLoginClick}> Login</Button>
      </div>
    </nav>
  );
};

export default Navbar;
