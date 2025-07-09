import { Outlet, Route, Router, Routes } from "react-router";
import { AppLayout } from "./layouts/AppLayout"
import { Home } from "./pages/App/Home";
import { Actions } from "./pages/App/Actions";
import { Action } from "./pages/App/Action";
import { Emissions } from "./pages/App/Emissions";
import { Goals } from "./pages/App/Goals";
import { Community } from "./pages/App/Community";
import { CommunityPost } from "./pages/App/CommunityPost";
import { ComposerPost } from "./pages/App/ComposerPost";
import { ProfileSettings } from "./pages/App/ProfileSettings";


function LayoutApp() {
  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  );
}

function App() {

  return (
    <Routes>
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
    </Routes>
  )
}

export default App
