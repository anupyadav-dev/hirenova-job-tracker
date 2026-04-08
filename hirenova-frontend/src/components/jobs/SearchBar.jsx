const SearchBar = ({ keyword, setKeyword, location, setLocation }) => {
  return (
    <div className="flex gap-2 mb-4">
      <input
        value={keyword}
        placeholder="Search job"
        className="border p-2"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <input
        value={location}
        placeholder="Location"
        className="border p-2"
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
