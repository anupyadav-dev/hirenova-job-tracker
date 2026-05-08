const FilterChips = ({ filters, setFilters }) => {
  const removeFilter = (key) => {
    setFilters({ [key]: "" });
  };

  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value && key !== "page" && key !== "sort",
  );

  if (!activeFilters.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
        >
          {key}: {value}
          <button onClick={() => removeFilter(key)}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default FilterChips;
