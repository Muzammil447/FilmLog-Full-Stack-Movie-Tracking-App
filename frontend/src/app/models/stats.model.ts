export interface GenreStats {
  genre: string;
  count: number;
}

export interface MovieWatchCount {
  title: string;
  timesWatched: number;
}

export interface WatchedMovieTable {
  title: string;
  year: string;
  genre: string;
  timesWatched: number;
}

export interface Stats {
  totalWatchedMovies: number;
  totalTimesWatched: number;
  topGenres: GenreStats[];
  timesWatchedPerMovie: MovieWatchCount[];
  watchedMovieTable: WatchedMovieTable[];
}
