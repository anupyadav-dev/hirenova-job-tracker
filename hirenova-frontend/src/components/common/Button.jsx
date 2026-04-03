const Button = ({ children, loading, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
