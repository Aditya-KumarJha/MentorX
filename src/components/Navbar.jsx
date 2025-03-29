import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import MentorX from "./MentorX.png";

function Navbar() {

    return (
        <nav className="fixed top-0 left-0 w-full shadow-md bg-zinc-900 px-6 py-4 overflow-hidden">

            <div className="container mx-auto px-6 py-4 flex justify-between items-center border-b-[1px]">
        
                <div className="flex items-center">
                    <Link to="/">
                        <img src={MentorX} alt="AI Mentor" className="h-10 w-auto" />  
                    </Link>
                    <Link to="/" className="text-xl font-bold text-white ml-2">
                        MentorX
                    </Link>
                </div>
                
                <div className="flex width-full items-center justify-between space-x-20">
                    <NavItem to="/mentor-ai" label="Mentor AI" />
                    <NavItem to="/path-finder" label="PathFinder AI" />
                    <NavItem to="/edumatrix" label="EduMatrix" />
                    <NavItem to="/community" label="Community" />
                </div>

                <div className="flex items-center space-x-4">
                    <Moon size={20} className="text-white" /> 
                    <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        SignUp
                    </Link>
                    <Link to="/login" className="px-4 py-2 text-white rounded-lg">
                        Log in
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function NavItem({ to, label }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={to} className="text-white hover:text-blue-400">
        {label}
      </Link>
    </motion.div>
  );
};

export default Navbar;