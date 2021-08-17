import { FC } from "react";
import { RouteProps, Route, Redirect } from "react-router-dom";

const isAuth = true;

const PrivateRoutes: FC<RouteProps> = ({ children }) => {
  if (!isAuth) return <Redirect to="/signin" />;

  return <Route>{children}</Route>;
};

export default PrivateRoutes;
