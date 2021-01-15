using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Entities;

namespace Tarea3.Entities
{

    public class MovieEntity
    {
        [Key]
        [Required]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public int? MinDuration { get; set; }
        public string Clasification { get; set; }
        [Required]
        public string Genre { get; set; }
        public int? Year { get; set; }
        public double? Rating { get; set; }
        public string Description { get; set; }
        public string PictureLink { get; set; }
        [ForeignKey("ProductionId")]
        public virtual ProductionEntity Production { get; set; }
    }
}
