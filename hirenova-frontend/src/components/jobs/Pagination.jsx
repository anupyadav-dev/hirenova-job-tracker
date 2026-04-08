const Pagination = ({ page, pages, onPageChange }) => {
  return (
    <div className="flex gap-2 mt-4">
      {[...Array(pages).keys()].map((x) => (
        <button
          key={x + 1}
          onClick={() => onPageChange(x + 1)}
          className={`border px-3 py-1 ${
            page === x + 1 ? "bg-blue-500 text-white" : ""
          }`}
        >
          {x + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
