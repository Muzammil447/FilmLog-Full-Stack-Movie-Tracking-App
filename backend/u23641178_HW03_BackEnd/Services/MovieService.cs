using System.Text.Json;
using System.Text.Json.Serialization;
using u23641178_HW03_BackEnd.DTOs;

namespace u23641178_HW03_BackEnd.Services
{
    public class MovieService : IMovieService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public MovieService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<List<MovieDto>> SearchMoviesAsync(string title)
        {
            var apiKey = _configuration["OMDb:ApiKey"];
            var baseUrl = _configuration["OMDb:BaseUrl"];

            if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(baseUrl))
            {
                throw new InvalidOperationException("OMDb settings are missing in appsettings.json.");
            }

            var url = $"{baseUrl}?apikey={apiKey}&s={Uri.EscapeDataString(title)}";

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return new List<MovieDto>();
            }

            var json = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var omdbResponse = JsonSerializer.Deserialize<OmdbSearchResponse>(json, options);

            if (omdbResponse == null || omdbResponse.Response == "False" || omdbResponse.Search == null)
            {
                return new List<MovieDto>();
            }

            return omdbResponse.Search.Select(movie => new MovieDto
            {
                Title = movie.Title ?? string.Empty,
                Year = movie.Year ?? string.Empty,
                Poster = movie.Poster ?? string.Empty,
                ImdbId = movie.ImdbId ?? string.Empty,
                Type = movie.Type ?? string.Empty,
                Actors = string.Empty,
                Genre = string.Empty,
                Plot = string.Empty
            }).ToList();
        }

        public async Task<MovieDto?> GetMovieDetailsAsync(string title)
        {
            var apiKey = _configuration["OMDb:ApiKey"];
            var baseUrl = _configuration["OMDb:BaseUrl"];

            if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(baseUrl))
            {
                throw new InvalidOperationException("OMDb settings are missing in appsettings.json.");
            }

            var url = $"{baseUrl}?apikey={apiKey}&t={Uri.EscapeDataString(title)}&plot=short";

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var movie = JsonSerializer.Deserialize<OmdbMovieDetailsResponse>(json, options);

            if (movie == null || movie.Response == "False")
            {
                return null;
            }

            return new MovieDto
            {
                Title = movie.Title ?? string.Empty,
                Year = movie.Year ?? string.Empty,
                Poster = movie.Poster ?? string.Empty,
                Actors = movie.Actors ?? string.Empty,
                Genre = movie.Genre ?? string.Empty,
                ImdbId = movie.ImdbId ?? string.Empty,
                Type = movie.Type ?? string.Empty,
                Plot = movie.Plot ?? string.Empty
            };
        }

        private class OmdbSearchResponse
        {
            public List<OmdbSearchMovie>? Search { get; set; }

            public string? Response { get; set; }

            public string? Error { get; set; }
        }

        private class OmdbSearchMovie
        {
            public string? Title { get; set; }

            public string? Year { get; set; }

            [JsonPropertyName("imdbID")]
            public string? ImdbId { get; set; }

            public string? Type { get; set; }

            public string? Poster { get; set; }
        }

        private class OmdbMovieDetailsResponse
        {
            public string? Title { get; set; }

            public string? Year { get; set; }

            public string? Poster { get; set; }

            public string? Actors { get; set; }

            public string? Genre { get; set; }

            [JsonPropertyName("imdbID")]
            public string? ImdbId { get; set; }

            public string? Type { get; set; }

            public string? Plot { get; set; }

            public string? Response { get; set; }

            public string? Error { get; set; }
        }
    }
}