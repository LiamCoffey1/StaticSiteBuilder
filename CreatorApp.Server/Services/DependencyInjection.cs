using Microsoft.Extensions.DependencyInjection;
using CreatorApp.Server.Repositories;
using CreatorApp.Generator;

namespace CreatorApp.Server.Services
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDomainServices(this IServiceCollection services)
        {
            services.AddScoped<IPagesService, PagesService>();
            services.AddScoped<IImagesService, ImagesService>();
            // register other domain services here
            return services;
        }
    }
}
