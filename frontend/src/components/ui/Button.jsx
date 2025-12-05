export const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 bg-linear-to-b from-yellow-200 via-yellow-300 to-yellow-400 text-black font-semibold rounded-lg cursor-pointer border-b border-yellow-500 shadow-sm hover:shadow-md ease-in-out duration-200 text-shadow-2xs text-shadow-amber-400"
    >
      {children}
    </button>
  );
};
