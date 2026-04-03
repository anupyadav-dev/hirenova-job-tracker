const ErrorState = ({ message }) => {
  return (
    <div className="text-center text-red-500 py-10">
      {message || "Something went wrong "}
    </div>
  );
};

export default ErrorState;
