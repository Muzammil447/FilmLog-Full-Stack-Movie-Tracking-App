namespace u23641178_HW03_BackEnd.Models
{
    public class AppUser
    {
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<WatchlistMovie> WatchlistMovies { get; set; } = new();

        public List<WatchedMovie> WatchedMovies { get; set; } = new();
    }
}