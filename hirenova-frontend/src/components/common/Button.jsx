function Button({ children, loading, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      className={`w-full py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
