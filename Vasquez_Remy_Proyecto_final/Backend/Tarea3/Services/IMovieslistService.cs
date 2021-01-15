using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Models;

namespace Tarea3.Services
{
    public interface IMovieslistService
    {
        Task<IEnumerable<MovieModel>> GetMoviesAsync(string orderBy,string phraseToSearch);
    }
}
