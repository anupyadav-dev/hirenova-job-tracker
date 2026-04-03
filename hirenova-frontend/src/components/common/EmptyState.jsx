const EmptyState = ({ message }) => {
  return (
    <div className="text-center text-gray-500 py-10">
      {message || "No data found 😕"}
    </div>
  );
};

export default EmptyState;
