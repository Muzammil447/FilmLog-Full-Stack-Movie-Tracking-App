export interface Movie {
  id?: number | string;
  title: string;
  year: string;
  poster: string;
  actors: string;
  genre: string;
  imdbId: string;
  type?: string;
  plot?: string;
  timesWatched?: number;
}
