import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import api from "../api";

function ListadoCursos() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const respuesta = await api.get("/cursos/");

        // Actualizamos los datos de cursos
        setDatos(respuesta.datos);

        // Y no tenemos errores
        setError(null);
      } catch (error) {
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchCursos();
  }, []);

  async function handleDelete(id_curso) {
    try {
      await api.delete("/cursos/" + id_curso);

      const datos_nuevos = datos.filter((curso) => curso.id_curso != id_curso);

      // Actualizamos los datos de cursos sin el que hemos borrado
      setDatos(datos_nuevos);

      // Y no tenemos errores
      setError(null);
    } catch (error) {
      setError(error.mensaje || "No se pudo conectar al servidor");
      setDatos([]);
    }
  }

  if (error != null) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      </>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          No hay cursos disponibles
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de cursos
      </Typography>

      <TableContainer component={Paper} sx={{ mx: 2, width: "auto" }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de cursos">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Imagen</TableCell>
              <TableCell>Ttiulo</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Horas</TableCell>
              <TableCell>Fecha Publicación</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row) => (
              <TableRow
                key={row.id_curso}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src={row.imagen_url}
                    alt="Logo"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{row.titulo}</TableCell>
                <TableCell>
                  {row.precio ? (
                    `${row.precio} €`
                  ) : (
                    <span style={{ color: "green" }}>Gratis</span>
                  )}
                </TableCell>
                <TableCell>{row.horas}</TableCell>
                <TableCell>{row.fecha_publicacion}</TableCell>

                <TableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      component={Link}
                      to={`/cursos/edit/${row.id_curso}`}
                      variant="contained"
                      size="small"
                      color="primary" // Azul para editar
                    >
                      ✏️
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.id_curso)}
                      variant="contained"
                      size="small"
                      color="error" // Rojo para borrar
                    >
                      🗑️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ListadoCursos;
