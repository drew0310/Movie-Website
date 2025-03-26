import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Snackbar from '../Snackbar/Snackbar';
import MovieList from '../MovieList/MovieList';
import Header from '../Header/Header';

const Home = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();

  const showSessionExpiredAlert = () => {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const checkTokenValidity = () => {
    const token = sessionStorage.getItem('cineflix_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          sessionStorage.clear();
          setUser(null);
          showSessionExpiredAlert();
        } else {
          const email = decoded.email;
          const username = email.split('@')[0];
          setUser(username.charAt(0).toUpperCase() + username.slice(1));
        }
      } catch (e) {
        sessionStorage.clear();
        setUser(null);
        showSessionExpiredAlert();
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setSearched(false); 
    setSearchQuery('');
  };

  const handleSearchMovie = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return; // Avoid empty searches

    setLoading(true);
    setSearched(true);
    const token = sessionStorage.getItem('cineflix_token');

    try {
      const response = await fetch(`https://cineflix-production.up.railway.app/movies/search/${trimmedQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {user && <Header />}
    <div className="home__wrapper">
      <div className="home">
        <div className="home__overlay">
          {user && (
            <div className="home__logout-container">
              <button className="home__logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          {user ? (
            <>
              <h1 className="home__title">Hi {user}!</h1>
              <h2>Countless stories waiting behind the search bar, start exploring!🍿🎬</h2><br />
              <div className="home__search-container">
                <input
                  type="text"
                  className="home__search-input"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="home__search-button" onClick={handleSearchMovie}>Search</button>
              </div>
            </>
          ) : (
            <>
              <h1 className="home__title">Welcome to Cineflix</h1>
              <h2>Explore from millions of movies. Share your views and opinions. All in one place.</h2><br />
              <div className="home__auth-buttons">
                <button className="home__auth-button" onClick={() => navigate("/register")}>Register</button>
                <button className="home__auth-button" onClick={() => navigate("/login")}>Login</button>
              </div>
            </>
          )}
        </div>
        <Snackbar message="Session expired. Please login again." visible={showSnackbar} />
      </div>
      {searched && <MovieList movies={movies} loading={loading} />}
    </div>
    </>
  );
};

export default Home;



