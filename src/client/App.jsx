import { useEffect, useState } from 'react';
import './App.css';
import MovieForm from './components/MovieForm';
import UserForm from './components/UserForm';

const apiUrl = 'http://localhost:4000';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then(res => res.json())
      .then(res => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    const res = await fetch('http://localhost:4000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password})
    })
  };

  const handleLogin = async ({ username, password }) => {
    const res = await fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, password: password})
    })

    const {data, id} = await res.json()

    const [bearer, token] = data.split(' ')

    localStorage.setItem('token', token)

    const resMovies = await fetch(`http://localhost:4000/movie?userId=${id}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    })

    const movieData = await resMovies.json()

    const usersMovies = movieData.data

    console.log("usersMovies", usersMovies)

    // const moviesList = [...movies, createdMovie]

    setMovies(usersMovies)
  };
  
  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const token = localStorage.getItem('token')

    // console.log("token", token)

    const res = await fetch('http://localhost:4000/movie', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', 'authorization': token
      },
      body: JSON.stringify({title: title, description: description, runtimeMins, runtimeMins})
    })

    const {data} = await res.json()

    const createdMovie = data

    // console.log("createdMovie", createdMovie)

    const moviesList = [...movies, createdMovie]

    setMovies(moviesList)
  }

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map(movie => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;