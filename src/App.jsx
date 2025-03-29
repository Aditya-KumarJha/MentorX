import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Description from './components/Description';
import EduMatrix from './components/Edumatrix';
import WebDeveloperPage from './components/WebDeveloperPage';  

function App() {
  return (
    <div className='w-full min-h-screen bg-zinc-900 text-white'>
      <Routes>
        <Route path="/" element={
            <>
              <Navbar />
              <Description />
            </>
          } 
        />
        <Route path="/edumatrix" element={<EduMatrix />} />
        <Route path="/web-developer" element={<WebDeveloperPage />} /> 
      </Routes>
    </div>
  );
}

export default App;