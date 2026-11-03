namespace u23641178_HW03_BackEnd.DTOs
{
    public class StatsDto
    {
        public int TotalWatchedMovies { get; set; }

        public int TotalTimesWatched { get; set; }

        public List<GenreStatsDto> TopGenres { get; set; } = new();

        public List<MovieWatchCountDto> TimesWatchedPerMovie { get; set; } = new();

        public List<WatchedMovieTableDto> WatchedMovieTable { get; set; } = new();
    }

    public class GenreStatsDto
    {
        public string Genre { get; set; } = string.Empty;

        public int Count { get; set; }
    }

    public class MovieWatchCountDto
    {
        public string Title { get; set; } = string.Empty;

        public int TimesWatched { get; set; }
    }

    public class WatchedMovieTableDto
    {
        public string Title { get; set; } = string.Empty;

        public string Year { get; set; } = string.Empty;

        public string Genre { get; set; } = string.Empty;

        public int TimesWatched { get; set; }
    }
}