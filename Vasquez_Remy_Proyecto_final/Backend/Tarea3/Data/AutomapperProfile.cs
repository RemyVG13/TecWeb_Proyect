using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Entities;
using Tarea3.Entities;
using Tarea3.Models;

namespace Tarea3.Data
{
    public class AutomapperProfile : Profile
    {
        public AutomapperProfile()
        {
            this.CreateMap<ProductionEntity, ProductionModel >().ReverseMap();

            this.CreateMap<MovieModel, MovieEntity>()
                .ForMember(des => des.Production, opt => opt.MapFrom(scr => new ProductionEntity { Id = scr.ProductionId }))
                .ReverseMap()
                .ForMember(dest => dest.ProductionId, opt => opt.MapFrom(scr => scr.Production.Id));
        }
    }
}
