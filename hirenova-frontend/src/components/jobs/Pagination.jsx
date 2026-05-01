const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < pages - 1) {
      rangeWithDots.push("...", pages);
    } else {
      rangeWithDots.push(pages);
    }

    return rangeWithDots;
  };

  const pagination = getPages();

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      {/* PREV */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:bg-gray-200"
      >
        ⬅PREV
      </button>

      {/* PAGE NUMBERS */}
      {pagination.map((p, index) =>
        p === "..." ? (
          <span key={index} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border rounded ${
              page === p ? "bg-blue-500 text-white" : ""
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* NEXT */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1 border rounded disabled:bg-gray-200"
      >
        NEXT ➡
      </button>
    </div>
  );
};

export default Pagination;
