using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Entities;
using Tarea3.Entities;

namespace Tarea3.Data.Repository
{
    public class LibraryRepository : ILibraryRepository
    {
      
        private LibraryDbContext _dbContext;
        public LibraryRepository(LibraryDbContext dbcontext)
        {
            _dbContext = dbcontext;
        }
        /*
        public MovieEntity CreateMovie(MovieEntity movie)
        {
            int newId;
            var lastMovie = movies.OrderByDescending(s => s.Id).FirstOrDefault();
            {
                newId = lastMovie.Id + 1;
            }           
            movie.Id = newId;
            movies.Add(movie);
            return movie;
        }*/
        public void CreateMovie(MovieEntity movie)
        {
            //_dbContext.Entry(movie.Production).State = EntityState.Unchanged;
            if (movie.Production != null)
            {
                _dbContext.Entry(movie.Production).State = EntityState.Unchanged;
            }
            _dbContext.Movies.Add(movie);
        }
        /*
        public bool DeleteMovie(int movieId)
        {
            var movieToDelete = movies.FirstOrDefault(c => c.Id == movieId);
            movies.Remove(movieToDelete);
            return true;
        }*/
        public bool DeleteMovie(int movieId)
        {
            var movieToDelete = new MovieEntity() { Id = movieId };
            _dbContext.Entry(movieToDelete).State = EntityState.Deleted;
            return true;
        }
        
        /*
        public MovieEntity GetMovie(int movieId)
        {
            return movies.FirstOrDefault(c => c.Id == movieId);
        }*/
        public async Task<MovieEntity> GetMovieAsync(int movieId)
        {
            IQueryable<MovieEntity> query = _dbContext.Movies;
            query = query.Include(v => v.Production);
            query = query.AsNoTracking();
            var movie = await query.SingleOrDefaultAsync(v => v.Id == movieId);
            return movie;
        }
        /*
        public IEnumerable<MovieEntity> GetMovies(string orderBy)
        {
            
            switch (orderBy)
            {
                case "id":
                    return movies.OrderBy(c => c.Id);
                case "title":
                    return movies.OrderBy(c => c.Title);
                case "genre":
                    return movies.OrderBy(c => c.Genre);
                case "minDuration":
                    return movies.OrderBy(c => c.Id);
                case "minAge":
                    return movies.OrderBy(c => c.Title);
                case "year":
                    return movies.OrderByDescending(c => c.Year);
                case "rating":
                    return movies.OrderByDescending(c => c.Rating);

                default:
                    return movies.OrderBy(c => c.Id);

            };
        }*/
        public async Task<IEnumerable<MovieEntity>> GetMoviesAsync(int productionId, string orderBy)
        {
            IQueryable<MovieEntity> query = _dbContext.Movies;
            
            query = query.Where(v => v.Production.Id == productionId);
            switch (orderBy)
            {
                case "id":
                    query = query.OrderBy(c => c.Id);
                    break;
                case "title":
                    query = query.OrderBy(c => c.Title);
                    break;
                case "genre":
                    query = query.OrderBy(c => c.Genre);
                    break;
                case "minDuration":
                    query = query.OrderBy(c => c.Id);
                    break;
                case "minAge":
                    query = query.OrderBy(c => c.Title);
                    break;
                case "year":
                    query = query.OrderByDescending(c => c.Year);
                    break;
                case "rating":
                    query = query.OrderByDescending(c => c.Rating);
                    break;
                default:
                    query = query.OrderBy(c => c.Id);
                    break;

            };
            query = query.Include(v => v.Production);
            query = query.AsNoTracking();

            return await query.ToArrayAsync(); ;
        }

        public async Task<bool> UpdateMovieAsync(int movieId, MovieEntity movie)
        {
            var movieToUpdated = await _dbContext.Movies.FirstOrDefaultAsync(v => v.Id == movieId);

            //_dbContext.Entry(movieToUpdated).CurrentValues.SetValues(movie);
            
            movieToUpdated.Title = movie.Title ?? movieToUpdated.Title;
            movieToUpdated.MinDuration = movie.MinDuration ?? movieToUpdated.MinDuration;
            movieToUpdated.Clasification = movie.Clasification ?? movieToUpdated.Clasification;
            movieToUpdated.Genre = movie.Genre ?? movieToUpdated.Genre;
            movieToUpdated.Year = movie.Year ?? movieToUpdated.Year;
            movieToUpdated.Rating = movie.Rating ?? movieToUpdated.Rating;
            movieToUpdated.PictureLink = movie.PictureLink ?? movieToUpdated.PictureLink;
            movieToUpdated.Description = movie.Description ?? movieToUpdated.Description;
            return true;
        }


        //Productions
        public void CreateProduction(ProductionEntity production)
        {
            _dbContext.Productions.Add(production);
        }

        public async Task<bool> DeleteProductionAsync(int productionId)
        {

            var productionToDelete = await _dbContext.Productions.FirstOrDefaultAsync(c => c.Id == productionId);
            var moviesToDelete = await GetMoviesAsync(productionId,"id");
            foreach(var movie in moviesToDelete)
            {
                var res =  DeleteMovie(movie.Id);
            }
            _dbContext.Productions.Remove(productionToDelete);

            return true;
        }

        public async Task<IEnumerable<ProductionEntity>> GetProductionsAsync(string orderBy)
        {
            IQueryable<ProductionEntity> query = _dbContext.Productions;
            query = query.AsNoTracking();

            switch (orderBy)
            {
                case "id":
                    query = query.OrderBy(c => c.Id);
                    break;
                case "name":
                    query = query.OrderBy(c => c.Name);
                    break;
                case "fundation-year":
                    query = query.OrderBy(c => c.FundationYear);
                    break;
                default:
                    query = query.OrderBy(c => c.Id); ;
                    break;
            }
            return await query.ToListAsync();
        }

        public async Task<ProductionEntity> GetProductionAsync(int productionId)
        {
            IQueryable<ProductionEntity> query = _dbContext.Productions;
            query = query.AsNoTracking();

            //tolist()
            //toArray()
            //foreach
            //firstOfDefaul
            //Single
            //Count

            return await query.FirstOrDefaultAsync(c => c.Id == productionId);
        }

        public bool UpdateProduction(ProductionEntity productionModel)
        {
            var productionToUpdate = _dbContext.Productions.FirstOrDefault(c => c.Id == productionModel.Id);

            _dbContext.Entry(productionToUpdate).CurrentValues.SetValues(productionModel);

            /*if (productionModel.Name != null)
            {
                _dbContext.Entry(productionModel).Property(p => p.Name).IsModified = true;
            }*/

            return true;
        }
        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                var res = await _dbContext.SaveChangesAsync();
                return res > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        
    }
}
