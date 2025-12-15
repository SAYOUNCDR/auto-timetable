import Landing from "./pages/public/Landing";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <div>
      <div className="min-h-screen max-w-7xl mx-auto flex items-center flex-col py-5 text-black pt-20">
        <Landing />
      </div>

      {/* <Dashboard /> */}
    </div>
  );
}

export default App;
