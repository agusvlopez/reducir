import { Outlet, Route, Router, Routes } from "react-router";
import { AppLayout } from "./layouts/AppLayout"
import { Home } from "./pages/App/Home";
import { Actions } from "./pages/App/Actions";
import { Action } from "./pages/App/Action";
import { Emissions } from "./pages/App/Emissions";
import { Goals } from "./pages/App/Goals";


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
        <Route path="/acciones" element={<Actions />} />
        <Route path="/acciones/:id" element={<Action />} />
        <Route path="/emisiones" element={<Emissions />} />
        <Route path="/emisiones/metas" element={<Goals />} />
      </Route>
    </Routes>
  )
}

export default App
