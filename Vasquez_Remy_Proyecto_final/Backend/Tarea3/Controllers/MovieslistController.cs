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
    public class MovieslistController : ControllerBase
    {
        private IMovieslistService _movieService;

        public MovieslistController(IMovieslistService movieService)
        {
            _movieService = movieService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieModel>>> GetMovies(int productionId, string orderBy = "Id")
        {
            try
            {
                /*
                if (showTop)
                {
                    return Ok(_movieService.GetMoviesTop5(showTop));
                }
                */
                Request.Headers.TryGetValue("phraseToSearch", out var traceValue);
                return Ok(await _movieService.GetMoviesAsync(orderBy, traceValue));
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

    }
}
