using System.Threading;
using System.Threading.Tasks;
using CreatorApp.Server.Data;
using CreatorApp.Server.Models.Auth;
using Microsoft.EntityFrameworkCore;

namespace CreatorApp.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) => _context = context;

        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
        }

        public async Task<User> AddAsync(User user, CancellationToken ct = default)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync(ct);
            return user;
        }
    }
}
