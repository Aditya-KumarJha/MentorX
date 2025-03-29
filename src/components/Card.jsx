import React from "react";

function Card() {

  const courses = [
    {
      title: "The Complete Full-Stack Web Development Bootcamp",
      description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, JavaScript, Node, React, PostgreSQL, Web3, and DApps.",
      instructor: "Dr. Angela Yu",
      rating: 4.7,
      reviews: "431,037",
      duration: "61.5 total hours · 374 lectures · All Levels",
      price: "₹3,099",
      image: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg",
    },
    {
      title: "The Web Developer Bootcamp 2025",
      description: "With 10 Hours of React added. Become a Developer With ONE course - HTML, CSS, JavaScript, React, Node, MongoDB and More!",
      instructor: "Colt Steele",
      rating: 4.7,
      reviews: "279,758",
      duration: "74 total hours · 731 lectures · All Levels",
      price: "₹3,299",
      image: "https://img-c.udemycdn.com/course/480x270/625204_436a_3.jpg",
    },
    {
      title: "Complete Full Stack Web Development Bootcamp - AI Integrated",
      description: "Complete Web Development in One Course with Modern Stack - JavaScript, Node.js, React, MongoDB, Linux and lots more!",
      instructor: "Manik (Cloudaffle)",
      rating: 4.7,
      reviews: "593",
      duration: "62.5 total hours · 495 lectures · All Levels",
      price: "₹2,899",
      image: "https://img-c.udemycdn.com/course/480x270/6061963_13c1_3.jpg",
    },
    {
      title: "Complete web development course",
      description: "Only web development course that you will need. Covers HTML, CSS, Tailwind, Node, React, MongoDB, Prisma, Deployment etc",
      instructor: "Hitesh Choudhary",
      rating: 4.7,
      reviews: "9,238",
      duration: "79.5 total hours · 231 lectures · All Levels",
      price: "₹3,099",
      image: "https://img-c.udemycdn.com/course/480x270/6035102_7d1a.jpg",
    },
  ];

  return (
    <div className="w-full py-2 px-4">
      <div className="w-full flex justify-center mb-2 mt-[-10px]">
        <h2 className="text-xl font-semibold text-white bg-zinc-900 py-1 px-6 rounded-md">
          Results for "Web Developer"
        </h2>
      </div>

      <div className="w-full max-w-4xl ml-auto mr-20">
        <div className="flex flex-col gap-6">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg flex p-6 w-full">
              <img
                src={course.image}
                alt={course.title}
                className="w-56 h-32 object-cover rounded-md"
              />
              <div className="ml-6 flex flex-col justify-between w-full">
                <h2 className="text-xl font-semibold text-black">{course.title}</h2>
                <p className="text-gray-400 text-base">{course.description}</p>
                <p className="text-gray-400 text-sm mt-2">{course.instructor}</p>
                <div className="flex items-center text-yellow-400 text-lg font-bold mt-1">
                  {course.rating} ⭐ ({course.reviews.toLocaleString()})
                </div>
                <p className="text-gray-400 text-sm mt-1">{course.duration}</p>
                <div className="mt-2 text-black font-semibold text-xl">{course.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
}

export default Card;
