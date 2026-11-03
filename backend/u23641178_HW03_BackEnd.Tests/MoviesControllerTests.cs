using Microsoft.AspNetCore.Mvc;
using Moq;
using u23641178_HW03_BackEnd.Controllers;
using u23641178_HW03_BackEnd.DTOs;
using u23641178_HW03_BackEnd.Services;

namespace u23641178_HW03_BackEnd.Tests
{
    public class MoviesControllerTests
    {
        [Fact]
        public async Task SearchMovies_WhenMoviesFound_ReturnsOkResult()
        {
            // Arrange
            var mockMovieService = new Mock<IMovieService>();

            var movies = new List<MovieDto>
            {
                new MovieDto
                {
                    Title = "Inception",
                    Year = "2010",
                    Poster = "poster-url",
                    Actors = "Leonardo DiCaprio",
                    Genre = "Action, Adventure, Sci-Fi",
                    ImdbId = "tt1375666",
                    Type = "movie",
                    Plot = "A dream-sharing movie."
                }
            };

            mockMovieService
                .Setup(service => service.SearchMoviesAsync("Inception"))
                .ReturnsAsync(movies);

            var controller = new MoviesController(mockMovieService.Object);

            // Act
            var result = await controller.SearchMovies("Inception");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedMovies = Assert.IsType<List<MovieDto>>(okResult.Value);

            Assert.Single(returnedMovies);
            Assert.Equal("Inception", returnedMovies[0].Title);
        }

        [Fact]
        public async Task SearchMovies_WhenNoMoviesFound_ReturnsNotFoundResult()
        {
            // Arrange
            var mockMovieService = new Mock<IMovieService>();

            mockMovieService
                .Setup(service => service.SearchMoviesAsync("UnknownMovie"))
                .ReturnsAsync(new List<MovieDto>());

            var controller = new MoviesController(mockMovieService.Object);

            // Act
            var result = await controller.SearchMovies("UnknownMovie");

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }
    }
}