using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Models;

namespace Tarea3.Services
{
    public interface IProductionsService
    {
        Task<IEnumerable<ProductionModel>> GetProductionsAsync(string orderBy);
        Task<ProductionModel> GetProductionAsync(int productionId);
        Task<ProductionModel> CreateProductionAsync(ProductionModel productionModel);
        Task<bool> DeleteProductionAsync(int productionId);
        Task<ProductionModel> UpdateProductionAsync(int productionId, ProductionModel productionModel);
    }
}
