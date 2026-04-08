const Skeleton = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-gray-300 w-1/2"></div>
      <div className="h-4 bg-gray-300 w-full"></div>
      <div className="h-4 bg-gray-300 w-3/4"></div>
    </div>
  );
};

export default Skeleton;
