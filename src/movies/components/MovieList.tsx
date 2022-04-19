import React, { useState } from 'react';

import { MovieCard } from './MovieCard';
import { AddMovieButton } from './AddMovieButton';
import { AddMovieForm } from './AddMovieForm';
import { Card } from 'shared/components';

import { useMovies } from './MovieProvider';

type NewMovieMode = "BUTTON" | "FORM"

export const MovieList = () => {
  const { movies, moviesDispatch } = useMovies();
  const [displayOptionType, setDisplayOptionType] = useState<NewMovieMode>('BUTTON');

  const addMovie = (movie: Record<"imageUrl" | "title" | "subtitle" | "description", string>) => {
    moviesDispatch({
      type: 'add',
      payload: { movie }
    })
    setDisplayOptionType('BUTTON');
  }
  
  return (
    <div className="card-deck">
      {movies.map(movie => (
        <Card key={movie.id}>
          <MovieCard key={movie.id} movie={movie} />
        </Card>
      ))}
      <Card>
        {
          displayOptionType === "BUTTON" &&
          <AddMovieButton onClick={() => setDisplayOptionType('FORM')} />
        }
        {
          displayOptionType === "FORM" &&
          <AddMovieForm onSubmit={addMovie} onCancel={() => setDisplayOptionType('BUTTON')} />
        }
      </Card>
    </div>
  );
}
