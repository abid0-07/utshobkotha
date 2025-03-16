"use client"
import SearchBar from "@/components/ui/search-bar";
import React, { useState } from "react";

  

const page = () => {
   const [query, setQuery] = useState<string>('');
   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     console.log("Search Query:", query);
     // Perform search logic here (e.g., API call or state update)
   };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl text-center">Explore Events</h1>
      <SearchBar onSearch={setQuery} />
    </div>
  );
};

export default page;
