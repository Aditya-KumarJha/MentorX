import React from 'react';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <div className='w-80 bg-zinc-100 p-6 rounded-md flex flex-col gap-4 pb-8 relative mt-10 shadow-lg'>
      <div className='w-full h-40 bg-orange-600 rounded-md overflow-hidden'>
        <img className='w-full h-full object-cover' src={course.image} alt={course.course} />
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className='text-2xl leading-none font-bold text-black'>{course.course}</h3>
        <p className='text-sm text-gray-600 mt-2'>{course.courseFuture}</p>
        <p className='text-sm font-semibold text-teal-700 mt-2'>{course.salary}</p>
      </div>

      <div className="mt-auto">
        <Link 
          to="/signup" 
          className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
        >
          Explore Course
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
