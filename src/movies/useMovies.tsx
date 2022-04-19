import React, { useReducer, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { Movie, MoviesAction } from 'types';
import { getMovies } from 'api/movies';

interface MoviesState {
  movies: Movie[]
  initialized: boolean
}

export function useMoviesCollection(): [MoviesState, React.Dispatch<MoviesAction>] {
  
  const movieReducer = (state: MoviesState, action: MoviesAction): MoviesState => {
    switch (action.type) {
      case 'fetch':
        return { initialized: true, movies: action.payload.data };
      case 'add':
        return {
          ...state,
          movies: [
            ...state.movies,
            { ...action.payload.movie, id: uuid(), ratings: [] }
          ]
        };
      case 'delete':
        return {
          ...state,
          movies: state.movies.filter(movie => movie.id !== action.payload.movieId)
        };
      case 'rate':
        const { movieId, rating } = action.payload;
        return {
          ...state,
          movies: state.movies.reduce((acc: Movie[], movie: Movie) => {
            if (movie.id === movieId) {
              movie.ratings.push(rating);
            }
            acc.push(movie);
            return acc;
          }, [])
        };
      default:
        return state
    }
  };

  const [state, dispatch] = useReducer(movieReducer, {
    movies: [],
    initialized: false,
  });

  useEffect(() => {
    const initialMoviesFetch = async () => {
      const movies = await getMovies();
      dispatch({
        type: 'fetch',
        payload: {
          data: movies
        }
      })
    }
    initialMoviesFetch();
  }, []);

  return [state, dispatch];
}
