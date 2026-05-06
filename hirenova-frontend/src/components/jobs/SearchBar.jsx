const SearchBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      jobType: "",
      category: "",
      minSalary: "",
      maxSalary: "",
      experience: "",
      sort: "latest",
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <input
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Search jobs, skills..."
          className="border p-2 rounded"
        />

        <input
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 rounded"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <select name="jobType" value={filters.jobType} onChange={handleChange}>
          <option value="">Job Type</option>
          <option value="full-time">Full Time</option>
          <option value="internship">Internship</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">Category</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>

        <input
          name="minSalary"
          type="number"
          value={filters.minSalary}
          onChange={handleChange}
          placeholder="Min Salary"
        />

        <input
          name="maxSalary"
          type="number"
          value={filters.maxSalary}
          onChange={handleChange}
          placeholder="Max Salary"
        />
      </div>

      <div className="flex justify-between items-center">
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="latest">Latest</option>
          <option value="salary">Salary High → Low</option>
          <option value="oldest">Oldest</option>
        </select>

        <button onClick={resetFilters} className="text-red-500 text-sm">
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
