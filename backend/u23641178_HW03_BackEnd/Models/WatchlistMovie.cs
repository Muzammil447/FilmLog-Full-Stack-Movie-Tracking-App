namespace u23641178_HW03_BackEnd.Models
{
    public class WatchlistMovie
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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}