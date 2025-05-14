const baseUrl = "http://localhost:3000/api";

const apiRoutes = {
  signup: `${baseUrl}/signup`,
  verifyEmail: `${baseUrl}/verifyemail`,
  login: `${baseUrl}/login`,
  logout: `${baseUrl}/logout`,
  changePassword: `${baseUrl}/changepassword`,
  resetPassword: {
    generate: `${baseUrl}/resetpassword/generate`,
    update: `${baseUrl}/resetpassword/update`,
  },
};

export default apiRoutes;
