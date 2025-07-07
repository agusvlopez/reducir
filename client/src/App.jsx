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
        <Route path="/home" element={<Home />} />
        <Route path="/actions" element={<Actions />} />
        <Route path="/actions/:id" element={<Action />} />
        <Route path="/emissions" element={<Emissions />} />
        <Route path="/emissions/goals" element={<Goals />} />
        <Route path="/community" element={<Community />} />
        <Route path="/:userId/post/:postId" element={<CommunityPost />} />
        <Route path="/compose/post/:postId" element={<ComposerPost />} />
      </Route>
    </Routes>
  )
}

export default App
