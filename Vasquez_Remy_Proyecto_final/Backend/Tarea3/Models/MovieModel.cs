using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Entities;

namespace Tarea3.Models
{
    public class MovieModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int MinDuration { get; set; }
        public string Clasification { get; set; }
        public string Genre { get; set; }
        public int Year { get; set; }
        public double Rating { get; set; }
        public string Description { get; set; }
        public string PictureLink { get; set; }
        public int ProductionId { get; set; }
    }
}
