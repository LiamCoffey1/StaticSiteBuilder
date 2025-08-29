using CreatorApp.Server.Data;
using CreatorApp.Server.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CreatorApp.Server.Repositories
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            // Register specific repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPageRepository, PageRepository>();

            // Backwards-compatible generic registrations if needed elsewhere
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            return services;
        }
    }
}
