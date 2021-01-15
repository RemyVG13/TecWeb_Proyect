using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Entities;
using Tarea3.Data.Repository;
using Tarea3.Exceptios;
using Tarea3.Models;

namespace Tarea3.Services
{
    public class ProductionsService : IProductionsService
    {
        ILibraryRepository _libraryRepository;
        private IMapper _mapper;

        private HashSet<string> allowedOrderByParameters = new HashSet<string>()
        {
            "id",
            "name",
            "fundation-year"
        };

        public ProductionsService(ILibraryRepository libraryRepository, IMapper mapper)
        {
            _libraryRepository = libraryRepository;
            _mapper = mapper;
        }

        public async Task<ProductionModel> CreateProductionAsync(ProductionModel productionModel)
        {
            var productionEntity = _mapper.Map<ProductionEntity>(productionModel);
            _libraryRepository.CreateProduction(productionEntity);
            var result = await _libraryRepository.SaveChangesAsync();

            if (result)
            {
                return _mapper.Map<ProductionModel>(productionEntity);
            }

            throw new Exception("Database Error");
        }

        public async Task<bool> DeleteProductionAsync(int productionId)
        {
            await GetProductionAsync(productionId);

            var DeleteResult = await _libraryRepository.DeleteProductionAsync(productionId);

            var saveResult = await _libraryRepository.SaveChangesAsync();

            if (!saveResult || !DeleteResult)
            {
                throw new Exception("Database Error");
            }


            if (saveResult)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<IEnumerable<ProductionModel>> GetProductionsAsync(string orderBy)
        {
            if (!allowedOrderByParameters.Contains(orderBy.ToLower()))
            {
                throw new BadRequestOperationException($"the field: {orderBy} is not supported, please use one of these {string.Join(",", allowedOrderByParameters)}");
            }

            var entityList = await _libraryRepository.GetProductionsAsync(orderBy);
            var modelList = _mapper.Map<IEnumerable<ProductionModel>>(entityList);
            return modelList;
        }

        public async Task<ProductionModel> GetProductionAsync(int productionID)
        {
            var production = await _libraryRepository.GetProductionAsync(productionID);
            if (production == null)
            {
                throw new NotFoundOperationException($"The production with id:{productionID} does not exists");
            }

            return _mapper.Map<ProductionModel>(production);
        }

        public async Task<ProductionModel> UpdateProductionAsync(int productionId, ProductionModel productionModel)
        {
            var productionEntity = _mapper.Map<ProductionEntity>(productionModel);
            await GetProductionAsync(productionId);
            productionEntity.Id = productionId;
            _libraryRepository.UpdateProduction(productionEntity);

            var saveResult = await _libraryRepository.SaveChangesAsync();
            if (!saveResult)
            {
                throw new Exception("Database Error");
            }
            return productionModel;
        }
    }
}
