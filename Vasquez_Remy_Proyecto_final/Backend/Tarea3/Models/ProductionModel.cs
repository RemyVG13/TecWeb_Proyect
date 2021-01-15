using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Entities;

namespace Tarea3.Models
{
    public class ProductionModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int? FundationYear { get; set; }
        public string Description { get; set; }
        public string PictureLink { get; set; }
        public ICollection<MovieEntity> Movies { get; set; }
    }
}
