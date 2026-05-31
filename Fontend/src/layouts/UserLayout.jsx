import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}