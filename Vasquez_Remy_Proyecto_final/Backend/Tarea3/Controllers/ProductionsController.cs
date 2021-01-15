using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Exceptios;
using Tarea3.Models;
using Tarea3.Services;

namespace Tarea3.Controllers
{
    
    [Route("api/[controller]")]
    public class ProductionsController : ControllerBase
    {
        private IProductionsService _productionService;

        public ProductionsController(IProductionsService productionService)
        {
            this._productionService = productionService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductionModel>>> GetProductionsAsync(string orderBy = "Id", bool showVideogames = false)
        {
            try
            {
                return Ok(await _productionService.GetProductionsAsync(orderBy));
            }
            catch (BadRequestOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("{productionId:int}")]
        public async Task<ActionResult<ProductionModel>> GetProductionAsync(int productionId, bool showVideogames = false)
        {
            try
            {
                return await _productionService.GetProductionAsync(productionId);
            }
            catch (NotFoundOperationException ex)
            {
                return NotFound(ex.Message); ;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductionModel>> CreateProductionAsync([FromBody] ProductionModel productionModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var newProduction = await _productionService.CreateProductionAsync(productionModel);

                var url = HttpContext.Request.Scheme;
                return Created($"{url}api/productions/{newProduction.Id}", newProduction);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{productionId:int}")]
        public async Task<ActionResult<bool>> DeleteproductionAsync(int productionId)
        {
            try
            {
                return Ok(await _productionService.DeleteProductionAsync(productionId));
            }
            catch (NotFoundOperationException ex)
            {
                return NotFound(ex.Message); ;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{productionId:int}")]
        public async Task<IActionResult> UpdateProductionAsync(int productionId, [FromBody] ProductionModel productionModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    foreach (var pair in ModelState)
                    {
                        if (pair.Key == nameof(productionModel.Name) && pair.Value.Errors.Count > 0)
                        {
                            return BadRequest(pair.Value.Errors);
                        }
                    }
                }

                return Ok(await _productionService.UpdateProductionAsync(productionId, productionModel));
            }
            catch (NotFoundOperationException ex)
            {
                return NotFound(ex.Message); ;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }
    }
}