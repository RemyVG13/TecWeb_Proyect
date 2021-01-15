using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Entities;
using Tarea3.Data.Repository;
using Tarea3.Entities;
using Tarea3.Exceptios;
using Tarea3.Models;

namespace Tarea3.Services
{
    public class MoviesService : IMoviesService
    {
        private ILibraryRepository _libraryRepository;

        private IMapper _mapper;

        private HashSet<string> allowedOrderByPArameters = new HashSet<string>()
        {
            "id",
            "title",
            "minduration",
            "clasification",
            "genre",
            "rating",
            "year",
        };
        private HashSet<string> allowedGenres = new HashSet<string>()
        {
            "action",
            "drama",
            "comedy",
            "fantasy",
            "horror",

        };

        public MoviesService(ILibraryRepository libraryRepository, IMapper mapper)
        {
            _libraryRepository = libraryRepository;
            _mapper = mapper;
        }

        public async Task<MovieModel> CreateMovieAsync(int productionId, MovieModel movieModel)
        {
            await validateProduction(productionId);
            var movieEntity = _mapper.Map<MovieEntity>(movieModel);
            movieEntity.Production = new ProductionEntity { Id = productionId };
            _libraryRepository.CreateMovie(movieEntity);
            var saveResult = await _libraryRepository.SaveChangesAsync();
            if (!saveResult)
            {
                throw new Exception("Save error");
            }
            var model = _mapper.Map<MovieModel>(movieEntity);
            model.ProductionId = productionId;
            return model;
        }

        private async Task validateProduction(int productionId)
        {

            var production = await _libraryRepository.GetProductionAsync(productionId);
            if (production == null)
            {
                throw new NotFoundOperationException($"The Production House id: {productionId}, doesn't exist");
            }
        }
        private async Task validateMovie(int movieId)
        {
            var movie = await _libraryRepository.GetMovieAsync(movieId);
            if (movie == null)
            {
                throw new NotFoundOperationException($"the movie id:{movieId}, doesn't exist");
            }
        }
        public async Task<bool> DeleteMovieAsync(int productionId, int movieId)
        {
            await GetMovieAsync(productionId,movieId);
            _libraryRepository.DeleteMovie(movieId);
            var saveResult = await _libraryRepository.SaveChangesAsync();
            if (!saveResult)
            {
                throw new Exception("Error while saving");
            }
            return true;
        }

        public async Task<MovieModel> GetMovieAsync(int productionId, int movieId)
        {
            await validateProduction(productionId);
            await validateMovie(movieId);
            var movie = await _libraryRepository.GetMovieAsync(movieId);
            if (movie == null)
            {
                throw new NotFoundOperationException($"The movie with id: { movieId } does not exist");
            }
            if (movie.Production.Id != productionId)
            {
                throw new NotFoundOperationException($"The movie with id: { movieId } does not exist");
            }
            return _mapper.Map<MovieModel>(movie);
        }
        public async Task<IEnumerable<MovieModel>> GetMoviesAsync(int productionId,string orderBy)
        {
            await validateProduction(productionId);
            if (!allowedOrderByPArameters.Contains(orderBy.ToLower()))
            {
                throw new BadRequestOperationException($"the field: {orderBy} is not " +
                    $"supported, please use one of these {string.Join(",", allowedOrderByPArameters)}");
            }

            var movies = await _libraryRepository.GetMoviesAsync(productionId, orderBy);
            var modelist = _mapper.Map<IEnumerable<MovieModel>>(movies);
            return modelist;

        }

        /*
        public IEnumerable<MovieModel> GetMoviesTop5(bool show)
        {

            var modelList = GetMovies("rating");

            var movielist = modelList.Take(5);
            //var movielist = modelList.Skip(2).Take(5);
            return movielist;
        }*/



        public async Task<bool> UpdateMovieAsync(int productionId,int movieId, MovieModel movieModel)
        {
            
            await GetMovieAsync(productionId, movieId);
            movieModel.Id = movieId;
            movieModel.ProductionId = productionId;
            var movieEntity = _mapper.Map<MovieEntity>(movieModel);

            await _libraryRepository.UpdateMovieAsync( movieId, movieEntity);

            var saveResult = await _libraryRepository.SaveChangesAsync();
            if (!saveResult)
            {
                throw new Exception("Error while saving");
            }
            return true;
        }
    }
}
