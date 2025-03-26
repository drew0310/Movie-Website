import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import MovieDetail from './components/MovieDetail/MovieDetail';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Intro from './components/Intro/Intro';
import { useEffect, useState } from 'react';
import MovieCategory from './components/MovieCategory/MovieCategory';
function App() {

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  if (showIntro) return <Intro onFinish={() => setShowIntro(false)} />;

  return (
    <div className="App">
      <div className='main__content'>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movies/:category" element={<MovieCategory />} />
          <Route path="/*" element={<h1>Error Page</h1>} />
        </Routes>
      </Router>
      </div>
    </div>
  );
}

export default App;
