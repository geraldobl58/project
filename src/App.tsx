import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { routes } from "./routes";

export const AppRouter = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

export const App = () => {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
};
