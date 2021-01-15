using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Repository;
using Tarea3.Entities;
using Tarea3.Exceptios;
using Tarea3.Models;

namespace Tarea3.Services
{
    public class MovieslistService : IMovieslistService
    {
        private ILibraryRepository _libraryRepository;

        private IMapper _mapper;

        private HashSet<string> allowedOrderByParameters = new HashSet<string>()
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

        public MovieslistService(ILibraryRepository libraryRepository, IMapper mapper)
        {
            _libraryRepository = libraryRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<ProductionModel>> GetProductionsAsync(string orderBy, bool showMovies)
        {
            if (!allowedOrderByParameters.Contains(orderBy.ToLower()))
            {
                throw new BadRequestOperationException($"the field: {orderBy} is not supported, please use one of these {string.Join(",", allowedOrderByParameters)}");
            }

            var entityList = await _libraryRepository.GetProductionsAsync(orderBy);
            var modelList = _mapper.Map<IEnumerable<ProductionModel>>(entityList);
            return modelList;
        }
        public async Task<IEnumerable<MovieModel>> GetMoviesAsync(string orderBy,string phraseToSearch="")
        {
            var productions = await GetProductionsAsync("id", true);
            int cont = 0;
            var movies = await _libraryRepository.GetMoviesAsync(productions.First().Id, orderBy);
            foreach (var prod in productions)
            {
                if (cont > 0)
                {
                    movies = movies.Concat(await _libraryRepository.GetMoviesAsync(prod.Id, orderBy));
                }
                cont++;              
            }

            if (!allowedOrderByParameters.Contains(orderBy.ToLower()))
            {
                throw new BadRequestOperationException($"the field: {orderBy} is not " +
                    $"supported, please use one of these {string.Join(",", allowedOrderByParameters)}");
            }

            switch (orderBy)
            {
                case "id":
                    movies = movies.OrderBy(c => c.Id);
                    break;
                case "title":
                    movies = movies.OrderBy(c => c.Title);
                    break;
                case "genre":
                    movies = movies.OrderBy(c => c.Genre);
                    break;
                case "minDuration":
                    movies = movies.OrderBy(c => c.Id);
                    break;
                case "minAge":
                    movies = movies.OrderBy(c => c.Title);
                    break;
                case "year":
                    movies = movies.OrderByDescending(c => c.Year);
                    break;
                case "rating":
                    movies = movies.OrderByDescending(c => c.Rating);
                    break;
                default:
                    movies = movies.OrderBy(c => c.Id);
                    break;

            };
            var modelIEnumerable = _mapper.Map<IEnumerable<MovieModel>>(movies);
            //var modelist = modelIEnumerable.ToList();
            var modelist = modelIEnumerable;
            if (phraseToSearch != null && phraseToSearch != "" )
            {
                modelist = modelIEnumerable.Where(movie => (movie.Description.ToLower().Contains(phraseToSearch.ToLower()) || movie.Title.ToLower().Contains(phraseToSearch.ToLower())));
           
            }
            
            return modelist;
        }
    }
}
