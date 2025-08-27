import AccessDenied from "./pages/AccessDenied";

const PrivateRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem('userInfo');

  // Check if userString is null or empty
  if (!userString) {
    return <AccessDenied />;
  }

  const user = JSON.parse(userString);

  // Ensure user object is valid
  if (!user) {
    return <AccessDenied />;
  }

  const isAdmin = user.isAdmin;
  const job = isAdmin ? "admin" : user.job;

  // Check if the user's role is included in allowedRoles
  if (!allowedRoles.includes(job)) {
    return <AccessDenied />;
  }

  return children;
};

export default PrivateRoute;
