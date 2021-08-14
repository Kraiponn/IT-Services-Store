import { Switch, Route, useRouteMatch } from "react-router-dom";
import HomePage from "pages/home";

const Routes = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`}>
        <HomePage />
      </Route>
    </Switch>
  );
};

export default Routes;
