import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Campaigns from "./pages/Campaigns.jsx";
import CampaignDetail from "./pages/CampaignDetail.jsx";
import CreateCampaign from "./pages/CreateCampaign.jsx";
import About from "./pages/About.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Privacy from "./pages/Privacy.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminOrgs from "./pages/AdminOrgs.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,           // ✅ layout chung (Navbar/Footer)
    children: [
      { index: true, element: <Home /> },
      { path: "campaigns", element: <Campaigns /> },
      { path: "campaign/:id", element: <CampaignDetail /> },
      { path: "create", element: <CreateCampaign /> },
      { path: "about", element: <About /> },
      { path: "how-it-works", element: <HowItWorks /> },
      { path: "privacy", element: <Privacy /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "admin/orgs", element: <AdminOrgs /> },
    ],
  },
]);
