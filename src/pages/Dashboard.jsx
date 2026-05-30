import { useAuth } from "../context/AuthContext";
import WorkerDashboard from "./WorkerDashboard";
import FactoryDashboard from "./FactoryDashboard";

// Picks the right dashboard based on the logged-in user's role.
export default function Dashboard() {
  const { user } = useAuth();
  return user?.type === "factory" ? <FactoryDashboard /> : <WorkerDashboard />;
}
