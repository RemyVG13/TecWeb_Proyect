using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Entities;
using Tarea3.Entities;

namespace Tarea3.Data.Repository
{
    public interface ILibraryRepository
    {
        //movies
        void CreateMovie(MovieEntity movie);
        Task<MovieEntity> GetMovieAsync(int movieId);
        Task<IEnumerable<MovieEntity>> GetMoviesAsync(int productionId,string orderBy);
        Task<bool> UpdateMovieAsync(int movieId, MovieEntity movie);
        bool DeleteMovie(int movieId);

        Task<bool> SaveChangesAsync();

        //productions
        Task<IEnumerable<ProductionEntity>> GetProductionsAsync(string orderBy);
        Task<ProductionEntity> GetProductionAsync(int productionId);
        void CreateProduction(ProductionEntity productionModel);
        Task<bool> DeleteProductionAsync(int productionId);
        bool UpdateProduction(ProductionEntity productionModel);
    }
}
