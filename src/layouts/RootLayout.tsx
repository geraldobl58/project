import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div>
      <header>Header</header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
};
