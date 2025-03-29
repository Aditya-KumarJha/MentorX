import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import CourseList from "./CourseList"; 

function Edumatrix() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.toLowerCase() === "web developer") {
            navigate("/web-developer");  
        }
    };

    return (
        <div className="text-white text-center p-10">
            <form onSubmit={handleSearch} className="flex justify-center">
                <div className="relative w-80">
                    <input
                        type="text"
                        placeholder="Search for courses"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 pr-10 rounded-lg bg-zinc-800 text-white outline-none"
                    />
                    <CiSearch 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer" 
                        onClick={handleSearch}
                    />
                </div>
            </form>

            <h1 className="mt-20 text-4xl font-semibold">
                Explore EduMatrix – <br /> Your gateway to finding the perfect courses tailored to your learning needs!
            </h1>
            <h2 className="mt-20 text-4xl font-semibold">
                Current Trending Courses
            </h2>

            <CourseList />
        </div>
    );
}

export default Edumatrix;
