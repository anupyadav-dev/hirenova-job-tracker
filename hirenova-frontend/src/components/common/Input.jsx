const Input = ({ label, ...props }) => {
  return (
    <div className="mb-3">
      {label && <label className="block mb-1">{label}</label>}
      <input {...props} className="w-full border p-2 rounded" />
    </div>
  );
};

export default Input;
