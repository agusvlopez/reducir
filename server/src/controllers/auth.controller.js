export class AuthController {
  static googleCallback(req, res) {
    try {
      const { accessToken, refreshToken, user } = req.user;

      res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'None',
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .redirect(`http://localhost:5173/app/home/${user._id}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect('http://localhost:5173/login?error=auth_failed');
    }
  }

  //todo: its not necessary, its already done in user
  static logout(req, res) {
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      res.redirect('http://localhost:5173/login');
    });
  }
}