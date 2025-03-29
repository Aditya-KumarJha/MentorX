import React from 'react';
import bg from './bg.png'

function Description() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-center">
            <div>
                <h1 className="mt-70 text-9xl font-medium select-none tracking-tight">
                    MentorX
                </h1>
                <h2 className="mt-6 text-6xl text-gray-400 select-none">
                    Next-gen AI mentorship
                </h2>
            </div>
            <div className="mt-28 w-4/5 flex flex-col items-center">
                <h3 className="text-5xl font-bold text-gray-700 select-none mb-10">
                    How It Works
                </h3>
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-10">
                    <div className="w-full md:w-1/2 space-y-6 text-left">
                        <div className="flex items-start space-x-4">
                            <span className="text-2xl font-bold">1</span>
                            <div>
                                <h4 className="text-xl font-semibold">Register</h4>
                                <p className="text-gray-600">Sign up and create your profile to get started.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <span className="text-2xl font-bold">2</span>
                            <div>
                                <h4 className="text-xl font-semibold">PathFinder AI</h4>
                                <p className="text-gray-600">Let us Help to design dedicated career path for you.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <span className="text-2xl font-bold">3</span>
                            <div>
                                <h4 className="text-xl font-semibold">Mentor AI</h4>
                                <p className="text-gray-600">Ask question and get your doubts solved with AI, and focus on career.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <span className="text-2xl font-bold">4</span>
                            <div>
                                <h4 className="text-xl font-semibold">Grow</h4>
                                <p className="text-gray-600">Leverage networking opportunities for career advancement.</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full  md:w-1/2 flex justify-center">
                        <img 
                            src={bg}
                            className="max-w-full h-auto object-cover rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Description;