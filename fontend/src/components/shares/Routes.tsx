import { Switch, Route } from "react-router-dom";
import HomeRoutes from "pages/home/components/Routes";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <HomeRoutes />
      </Route>
    </Switch>
  );
};

export default Routes;
