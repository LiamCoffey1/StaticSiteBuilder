using System.Threading;
using System.Threading.Tasks;
using CreatorApp.Server.Models.Auth;

namespace CreatorApp.Server.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
        Task<User> AddAsync(User user, CancellationToken ct = default);
    }
}
