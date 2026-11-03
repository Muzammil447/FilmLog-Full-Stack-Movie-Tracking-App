using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using u23641178_HW03_BackEnd.Data;
using u23641178_HW03_BackEnd.DTOs;

namespace u23641178_HW03_BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim))
            {
                throw new UnauthorizedAccessException("User ID not found in token.");
            }

            return int.Parse(userIdClaim);
        }

        [HttpGet]
        public async Task<ActionResult<StatsDto>> GetStats()
        {
            var userId = GetUserId();

            var watchedMovies = await _context.WatchedMovies
                .Where(movie => movie.AppUserId == userId)
                .ToListAsync();

            var genreStats = watchedMovies
                .Where(movie => !string.IsNullOrWhiteSpace(movie.Genre))
                .SelectMany(movie => movie.Genre
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(genre => genre.Trim()))
                .GroupBy(genre => genre)
                .Select(group => new GenreStatsDto
                {
                    Genre = group.Key,
                    Count = group.Count()
                })
                .OrderByDescending(item => item.Count)
                .Take(6)
                .ToList();

            var timesWatchedPerMovie = watchedMovies
                .OrderByDescending(movie => movie.TimesWatched)
                .Take(10)
                .Select(movie => new MovieWatchCountDto
                {
                    Title = movie.Title,
                    TimesWatched = movie.TimesWatched
                })
                .ToList();

            var tableData = watchedMovies
                .OrderByDescending(movie => movie.WatchedAt)
                .Select(movie => new WatchedMovieTableDto
                {
                    Title = movie.Title,
                    Year = movie.Year,
                    Genre = movie.Genre,
                    TimesWatched = movie.TimesWatched
                })
                .ToList();

            var stats = new StatsDto
            {
                TotalWatchedMovies = watchedMovies.Count,
                TotalTimesWatched = watchedMovies.Sum(movie => movie.TimesWatched),
                TopGenres = genreStats,
                TimesWatchedPerMovie = timesWatchedPerMovie,
                WatchedMovieTable = tableData
            };

            return Ok(stats);
        }
    }
}