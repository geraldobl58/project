import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { routes } from "./routes";

export const AppRouter = () => {
  const routeElements = useRoutes(routes);
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">{routeElements}</main>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <SidebarProvider>
        <AppRouter />
      </SidebarProvider>
    </Router>
  );
};
