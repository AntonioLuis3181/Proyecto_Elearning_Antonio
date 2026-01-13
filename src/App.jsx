import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Inicio from "./components/Inicio";
import ListadoPlataformas from "./components/ListadoPlataformas";
import ListadoCardsPlataformas from "./components/ListadoCardsPlataformas";
import AltaPlataforma from "./components/AltaPlataforma";
import EditarPlataforma from "./components/EditarPlataforma";

import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      // Todo esto se ve en el Outlet
      { index: true, Component: Inicio }, // Esto se ve en la ruta padre
      {
        path: "/plataformas",
        element: <ListadoPlataformas/>,
      },
            {
        path: "/plataformas/cards",
        element: <ListadoCardsPlataformas/>,
      },
      {
        path: "/plataformas/new",
        element: <AltaPlataforma />,
      },
      {
        path: "/curso/edit/:id_plataforma",
        element: <EditarPlataforma />,
      },
      {
        path: "/cursos",
        element: <h1>Listado de cursos</h1>,
      },
      {
        path: "/cursos/new",
        element: <h1>Alta de cursos</h1>,
      },
    ],
  },
]);

function App() {
  
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
