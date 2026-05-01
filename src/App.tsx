import { RouterProvider } from "react-router-dom";
import { router } from "./router"; // apna correct path
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;