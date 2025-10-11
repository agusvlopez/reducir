import { Suspense, lazy } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute.jsx";
import { Loader } from "./components/Base/Loader.jsx";


// Lazy loading de componentes (named exports)
const Home = lazy(() => import("./pages/App/Home").then(m => ({ default: m.Home })));
const Actions = lazy(() => import("./pages/App/Actions").then(m => ({ default: m.Actions })));
const Action = lazy(() => import("./pages/App/Action").then(m => ({ default: m.Action })));
const Emissions = lazy(() => import("./pages/App/Emissions").then(m => ({ default: m.Emissions })));
const Goals = lazy(() => import("./pages/App/Goals").then(m => ({ default: m.Goals })));
const Community = lazy(() => import("./pages/App/Community").then(m => ({ default: m.Community })));
const CommunityPost = lazy(() => import("./pages/App/CommunityPost").then(m => ({ default: m.CommunityPost })));
const ComposerPost = lazy(() => import("./pages/App/ComposerPost").then(m => ({ default: m.ComposerPost })));
const ProfileSettings = lazy(() => import("./pages/App/ProfileSettings").then(m => ({ default: m.ProfileSettings })));
const Login = lazy(() => import("./pages/App/Login").then(m => ({ default: m.Login })));
const Register = lazy(() => import("./pages/App/Register").then(m => ({ default: m.Register })));
const Welcome = lazy(() => import("./pages/App/Welcome").then(m => ({ default: m.Welcome })));
const IntroTest = lazy(() => import("./pages/App/Test/IntroTest").then(m => ({ default: m.IntroTest })));
const FormTest = lazy(() => import("./pages/App/Test/FormTest").then(m => ({ default: m.FormTest })));

function LayoutApp() {
  return (
    <AppLayout>
      <Suspense fallback={<Loader size="lg" />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

function App() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="md" color="green" />
      </div>
    }>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test/intro" element={<IntroTest />} />
        <Route path="/test/form" element={<FormTest />} />
        
        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutApp />}>
            <Route path="/app/home" element={<Home />} />
            <Route path="/app/actions" element={<Actions />} />
            <Route path="/app/actions/:id" element={<Action />} />
            <Route path="/app/emissions" element={<Emissions />} />
            <Route path="/app/emissions/goals" element={<Goals />} />
            <Route path="/app/community" element={<Community />} />
            <Route path="/app/:userId/post/:postId" element={<CommunityPost />} />
            <Route path="/app/compose/post/:postId" element={<ComposerPost />} />
            <Route path="/app/profile/settings" element={<ProfileSettings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;