using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Models;

namespace Tarea3.Services
{
    public interface IMoviesService
    {
        /*
        MovieModel CreateMovie(MovieModel movie);
        IEnumerable<MovieModel> GetMovies(string orderBy);
        IEnumerable<MovieModel> GetMoviesTop5(bool show);

        MovieModel GetMovie(int movieId);
        bool UpdateMovie(int movieId, MovieModel movie);
        bool DeleteMovie(int movieId);*/
        Task<MovieModel> CreateMovieAsync(int productionId, MovieModel movie);
        Task<MovieModel> GetMovieAsync(int productionId, int movieId);
        Task<IEnumerable<MovieModel>> GetMoviesAsync(int productionId,string orderBy);
        Task<bool> UpdateMovieAsync(int productionId, int videogameId, MovieModel movie);
        Task<bool> DeleteMovieAsync(int productionId, int videogameId);
    }
}
