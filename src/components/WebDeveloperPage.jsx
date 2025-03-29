import React from "react";
import Card from "./Card";
import { FiFilter } from "react-icons/fi"; 
import { FaChevronDown } from "react-icons/fa"; 

function WebDeveloperPage() {
  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white flex justify-center p-10">
      <div className="w-full max-w-6xl flex gap-6">
        <div className="w-3/4">
          <Card />
        </div>

        <div className="w-1/4 flex flex-col gap-4 mt-20">
          <button className="flex items-center border border-gray-400 rounded-md px-4 py-2 text-black bg-white font-semibold w-full">
            <FiFilter className="mr-2 text-lg" /> Filter
          </button>

          {[
            "Sort by",
            "Ratings",
            "Languages",
            "Topics",
            "Subtitles",
            "Prices"
          ].map((filter, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-md px-4 py-2 bg-white text-black font-semibold w-full"
            >
              <p className="text-xs text-gray-500">{filter}</p>
              <div className="flex justify-between items-center">
                <span>Choose {filter.toLowerCase()}</span>
                <FaChevronDown className="text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WebDeveloperPage;
