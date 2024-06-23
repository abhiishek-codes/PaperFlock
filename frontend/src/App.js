import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import LoginSignupPage from "./components/pages/LoginSignup";
import EditDocument from "./components/document/EditDocument";
import AllDocuments from "./components/pages/AllDocuments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginSignupPage />,
  },
  {
    path: "/documents",
    element: <AllDocuments />,
  },
  {
    path: "/documents/:documenttitle/",
    element: <EditDocument />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
