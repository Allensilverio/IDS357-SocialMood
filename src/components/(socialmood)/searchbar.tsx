import React, { ChangeEvent } from "react";

interface SearchBarProps {
  handleChange: (alias : string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ handleChange }) => {


  const HandleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        onChange={HandleSearch}
        className="w-full bg-white/10 text-white border border-white/30 rounded-[10px] py-2 px-4 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
      />
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 4a7 7 0 017 7v0a7 7 0 01-7 7v0a7 7 0 01-7-7v0a7 7 0 017-7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 16l4 4"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
