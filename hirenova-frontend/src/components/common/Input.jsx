function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="text-sm block mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Input;
