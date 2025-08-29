using CreatorApp.Server.Models.Auth;

namespace CreatorApp.Server.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
