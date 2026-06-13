function SearchButton({ loading, onClick }) {
  return (
    <button className="btn-search" onClick={onClick} disabled={loading}>
      {loading ? (
        <>
          <div className="spinner"></div>
          SCANNING...
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          FIND PLACE
        </>
      )}
    </button>
  );
}

export default SearchButton;
