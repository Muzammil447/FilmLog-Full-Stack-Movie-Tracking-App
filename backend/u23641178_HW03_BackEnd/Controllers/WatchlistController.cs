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
    public class WatchlistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WatchlistController(AppDbContext context)
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
        public async Task<ActionResult<List<WatchlistMovie>>> GetWatchlist()
        {
            var userId = GetUserId();

            var watchlist = await _context.WatchlistMovies
                .Where(movie => movie.AppUserId == userId)
                .OrderByDescending(movie => movie.CreatedAt)
                .ToListAsync();

            return Ok(watchlist);
        }

        [HttpPost]
        public async Task<IActionResult> AddToWatchlist(MovieDto movieDto)
        {
            var userId = GetUserId();

            if (string.IsNullOrWhiteSpace(movieDto.Title))
            {
                return BadRequest(new { message = "Movie title is required." });
            }

            var alreadyExists = await _context.WatchlistMovies
                .AnyAsync(movie =>
                    movie.AppUserId == userId &&
                    movie.Title.ToLower() == movieDto.Title.ToLower());

            if (alreadyExists)
            {
                return BadRequest(new { message = "Movie is already in your Watchlist." });
            }

            var alreadyWatched = await _context.WatchedMovies
                .AnyAsync(movie =>
                    movie.AppUserId == userId &&
                    movie.Title.ToLower() == movieDto.Title.ToLower());

            if (alreadyWatched)
            {
                return BadRequest(new { message = "Movie is already in your Watched List." });
            }

            var watchlistMovie = new WatchlistMovie
            {
                AppUserId = userId,
                Title = movieDto.Title,
                Year = movieDto.Year,
                Poster = movieDto.Poster,
                Actors = movieDto.Actors,
                Genre = movieDto.Genre,
                ImdbId = movieDto.ImdbId,
                CreatedAt = DateTime.UtcNow
            };

            _context.WatchlistMovies.Add(watchlistMovie);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Movie added to Watchlist.",
                movie = watchlistMovie
            });
        }

        [HttpDelete("{title}")]
        public async Task<IActionResult> RemoveFromWatchlist(string title)
        {
            var userId = GetUserId();

            var movie = await _context.WatchlistMovies
                .FirstOrDefaultAsync(movie =>
                    movie.AppUserId == userId &&
                    movie.Title.ToLower() == title.ToLower());

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found in Watchlist." });
            }

            _context.WatchlistMovies.Remove(movie);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie removed from Watchlist." });
        }
    }
}