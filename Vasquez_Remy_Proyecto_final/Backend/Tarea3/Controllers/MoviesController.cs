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
    
    [Route("api/productions/{productionId:int}/[controller]")]
    public class MoviesController : ControllerBase
    {
        private IMoviesService _movieService;

        public MoviesController(IMoviesService movieService)
        {
            _movieService = movieService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieModel>>> GetMovies(int productionId,string orderBy = "Id"/*, bool showTop = false*/)
        {
            try
            {

                return Ok(await _movieService.GetMoviesAsync(productionId, orderBy));
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
        [HttpGet("{movieId:int}")]
        public async Task<ActionResult<MovieModel>> GetMovie(int productionId,int movieId)
        {
            try
            {
                
                return Ok(await _movieService.GetMovieAsync(productionId,movieId));
            }
            catch (Exception ex)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }

        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<MovieModel>> CreateMovieAsync(int productionId,[FromBody] MovieModel movieModel)
        {
            try
            {
                var newMovie = await _movieService.CreateMovieAsync(productionId, movieModel);

                var url = HttpContext.Request.Scheme;
                return Created($"{url}api/productions/{productionId}/movies/{newMovie.Id}", newMovie);
                //return CreatedAtRoute("GetMovie", new { productionId = productionId, movieId = newMovie.Id }, newMovie);
            }
            catch(NotFoundOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{movieId:int}")]
        public async Task<ActionResult<bool>> Deletemovie(int productionId,int movieId)
        {
            try
            {
                return Ok(await _movieService.DeleteMovieAsync(productionId,movieId));
            }
            catch (NotFoundOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{movieId:int}")]
        public async Task<ActionResult<bool>> UpdateMovieAsync(int productionId, int movieId, [FromBody] MovieModel movieModel)
        {
            try
            {
                return Ok(await _movieService.UpdateMovieAsync(productionId, movieId, movieModel));

            }
            catch (NotFoundOperationException ex)
            {
                return NotFound(ex.Message);
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
