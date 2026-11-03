using u23641178_HW03_BackEnd.DTOs;

namespace u23641178_HW03_BackEnd.Services
{
    public interface IMovieService
    {
        Task<List<MovieDto>> SearchMoviesAsync(string title);

        Task<MovieDto?> GetMovieDetailsAsync(string title);
    }
}