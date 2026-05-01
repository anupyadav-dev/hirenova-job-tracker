import { useState } from "react";

const JobFilters = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-3 mb-5"
    >
      <input
        type="text"
        placeholder="Search jobs..."
        className="border p-2 rounded w-full"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
      />

      <input
        type="text"
        placeholder="Location..."
        className="border p-2 rounded w-full"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />

      <button className="bg-blue-600 text-white px-4 rounded">Search</button>
    </form>
  );
};

export default JobFilters;
