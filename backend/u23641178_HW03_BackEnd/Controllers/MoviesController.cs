using Microsoft.AspNetCore.Mvc;
using u23641178_HW03_BackEnd.DTOs;
using u23641178_HW03_BackEnd.Services;

namespace u23641178_HW03_BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<MovieDto>>> SearchMovies([FromQuery] string t)
        {
            if (string.IsNullOrWhiteSpace(t))
            {
                return BadRequest(new { message = "Movie title is required." });
            }

            var movies = await _movieService.SearchMoviesAsync(t);

            if (movies.Count == 0)
            {
                return NotFound(new { message = "No movies found." });
            }

            return Ok(movies);
        }

        [HttpGet("details")]
        public async Task<ActionResult<MovieDto>> GetMovieDetails([FromQuery] string t)
        {
            if (string.IsNullOrWhiteSpace(t))
            {
                return BadRequest(new { message = "Movie title is required." });
            }

            var movie = await _movieService.GetMovieDetailsAsync(t);

            if (movie == null)
            {
                return NotFound(new { message = "Movie details not found." });
            }

            return Ok(movie);
        }
    }
}