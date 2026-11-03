namespace u23641178_HW03_BackEnd.Models
{
    public class WatchedMovie
    {
        public int Id { get; set; }

        public int AppUserId { get; set; }

        public AppUser? AppUser { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Year { get; set; } = string.Empty;

        public string Poster { get; set; } = string.Empty;

        public string Actors { get; set; } = string.Empty;

        public string Genre { get; set; } = string.Empty;

        public string ImdbId { get; set; } = string.Empty;

        public int TimesWatched { get; set; } = 1;

        public DateTime WatchedAt { get; set; } = DateTime.UtcNow;
    }
}