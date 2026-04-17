import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { BusinessProvider } from "./context/BusinessContext";

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BusinessProvider>
        <AppRoutes />
        </BusinessProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;