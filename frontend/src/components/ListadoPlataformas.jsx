import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../api";
import { useNavigate } from "react-router-dom";

function ListadoPlataformas() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlataformas() {
      try {
        const respuesta = await api.get("/plataformas/");

        // Actualizamos los datos de plataformas
        setDatos(respuesta.datos);

        // Y no tenemos errores
        setError(null);
      } catch (error) {
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchPlataformas();
  }, []);

  async function handleDelete(id_plataforma) {
    try {
      await api.delete("/plataformas/" + id_plataforma);

      const datos_nuevos = datos.filter( plataforma => plataforma.id_plataforma != id_plataforma);

      // Actualizamos los datos de plataformas sin el que hemos borrado
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
          No hay plataformas disponibles
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de plataformas
      </Typography>

      <TableContainer component={Paper}>
        <Table stickyHeader ria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>url_web</TableCell>
              <TableCell>es_gratuita</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row) => (
              <TableRow key={row.id_plataforma}>
                <TableCell>{row.nombre}</TableCell>
                <TableCell align="center">{row.url_web}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: "500px",
                    textWrap: "wrap",
                    overflow: "hidden",
                  }}
                >
                  {row.es_gratuita}
                </TableCell>
                <TableCell>
                  <Avatar alt={row.nombre} src={row.url_web} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(row.id_plataforma)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    sx={{ml: 1}}
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/plataformas/edit/' + row.id_plataforma)}
                  >
                    <EditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ListadoPlataformas;