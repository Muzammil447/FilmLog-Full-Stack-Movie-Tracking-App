using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using u23641178_HW03_BackEnd.Data;
using u23641178_HW03_BackEnd.DTOs;
using u23641178_HW03_BackEnd.Models;

namespace u23641178_HW03_BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WatchedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WatchedController(AppDbContext context)
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
        public async Task<ActionResult<List<WatchedMovie>>> GetWatchedList()
        {
            var userId = GetUserId();

            var watchedList = await _context.WatchedMovies
                .Where(movie => movie.AppUserId == userId)
                .OrderByDescending(movie => movie.WatchedAt)
                .ToListAsync();

            return Ok(watchedList);
        }

        [HttpPost]
        public async Task<IActionResult> MarkAsWatched(MovieDto movieDto)
        {
            var userId = GetUserId();

            if (string.IsNullOrWhiteSpace(movieDto.Title))
            {
                return BadRequest(new { message = "Movie title is required." });
            }

            var existingWatchedMovie = await _context.WatchedMovies
                .FirstOrDefaultAsync(movie =>
                    movie.AppUserId == userId &&
                    movie.Title.ToLower() == movieDto.Title.ToLower());

            if (existingWatchedMovie != null)
            {
                existingWatchedMovie.TimesWatched += 1;
                existingWatchedMovie.WatchedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Times watched updated.",
                    movie = existingWatchedMovie
                });
            }

            var watchlistMovie = await _context.WatchlistMovies
                .FirstOrDefaultAsync(movie =>
                    movie.AppUserId == userId &&
                    movie.Title.ToLower() == movieDto.Title.ToLower());

            if (watchlistMovie != null)
            {
                _context.WatchlistMovies.Remove(watchlistMovie);
            }

            var watchedMovie = new WatchedMovie
            {
                AppUserId = userId,
                Title = movieDto.Title,
                Year = movieDto.Year,
                Poster = movieDto.Poster,
                Actors = movieDto.Actors,
                Genre = movieDto.Genre,
                ImdbId = movieDto.ImdbId,
                TimesWatched = 1,
                WatchedAt = DateTime.UtcNow
            };

            _context.WatchedMovies.Add(watchedMovie);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Movie marked as watched.",
                movie = watchedMovie
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWatchedMovie(int id)
        {
            var userId = GetUserId();

            var movie = await _context.WatchedMovies
                .FirstOrDefaultAsync(movie =>
                    movie.Id == id &&
                    movie.AppUserId == userId);

            if (movie == null)
            {
                return NotFound(new { message = "Watched movie not found." });
            }

            movie.TimesWatched += 1;
            movie.WatchedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Times watched incremented.",
                movie
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromWatchedList(int id)
        {
            var userId = GetUserId();

            var movie = await _context.WatchedMovies
                .FirstOrDefaultAsync(movie =>
                    movie.Id == id &&
                    movie.AppUserId == userId);

            if (movie == null)
            {
                return NotFound(new { message = "Watched movie not found." });
            }

            _context.WatchedMovies.Remove(movie);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie removed from Watched List." });
        }

        [HttpPost("reset/{id}")]
        public async Task<IActionResult> ResetWatchedMovie(int id)
        {
            var userId = GetUserId();

            var watchedMovie = await _context.WatchedMovies
                .FirstOrDefaultAsync(movie =>
                    movie.Id == id &&
                    movie.AppUserId == userId);

            if (watchedMovie == null)
            {
                return NotFound(new { message = "Watched movie not found." });
            }

            var alreadyInWatchlist = await _context.WatchlistMovies
                .AnyAsync(movie =>
                    movie.AppUserId == userId &&
                    movie.Title.ToLower() == watchedMovie.Title.ToLower());

            if (!alreadyInWatchlist)
            {
                var watchlistMovie = new WatchlistMovie
                {
                    AppUserId = userId,
                    Title = watchedMovie.Title,
                    Year = watchedMovie.Year,
                    Poster = watchedMovie.Poster,
                    Actors = watchedMovie.Actors,
                    Genre = watchedMovie.Genre,
                    ImdbId = watchedMovie.ImdbId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.WatchlistMovies.Add(watchlistMovie);
            }

            _context.WatchedMovies.Remove(watchedMovie);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie reset and moved back to Watchlist." });
        }
    }
}