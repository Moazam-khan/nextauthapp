const baseUrl = `http://localhost:3000/api/`;

const apiRoutes = {
  signup: `${baseUrl}/users/signup`,
  verifyEmail: `${baseUrl}/users/verifyemail`,
  login: `${baseUrl}/users/login`,
  logout: `${baseUrl}/users/logout`,
  changePassword: `${baseUrl}/users/changepassword`,
  resetPassword: {
    generate: `${baseUrl}/users/resetpassword/generate`,
    update: `${baseUrl}/users/resetpassword/update`,
  },
};

export default apiRoutes;
