import React from 'react';
import CourseCard from './CourseCard'; 

function CourseList() {

  const courses = [
    {
      image: 'https://plus.unsplash.com/premium_photo-1661878265739-da90bc1af051?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8fDA%3D',
      course: 'Data Science',
      courseFuture: 'Growing demand in AI, healthcare, and finance industries.',
      salary: 'Salary: ₹12–20 LPA (India) | $120K+ (Global)'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1684225764999-3597a8da10ab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D',
      course: 'Digital Marketing',
      courseFuture: 'Video & Short Content, Data Analytics Focus, Metaverse & AR Marketing',
      salary: 'Salary: ₹3-10 LPA (India) | $50K+ (Global)'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1661764393655-1dbffee8c0ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3liZXJzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D',
      course: 'Cyber Security',
      courseFuture: 'Job Growth: 32%+ by 2030, In-Demand Roles: Ethical Hacker, SOC Analyst, Security Enginee',
      salary: 'Salary: ₹10–20 LPA (India) | $110K+ (Global)'
    },
    {
      image: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dWklMjB1eXxlbnwwfHwwfHx8MA%3D%3D',
      course: 'UI/UX Design',
      courseFuture: 'Ever-growing field in mobile app and website development.',
      salary: 'Salary: ₹7–12 LPA (India) | $85K+ (Global)'
    }
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10'>
      {courses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
    </div>
  );
}

export default CourseList;
