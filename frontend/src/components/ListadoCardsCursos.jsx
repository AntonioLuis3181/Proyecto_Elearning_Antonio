import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import api from "../api";

function ListadoCardCursos() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const respuesta = await api.get("/cursos/");
        console.log("LO QUE LLEGA DE LA API:", respuesta)
        setDatos(respuesta.datos);
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
      const datos_nuevos = datos.filter(
        (curso) => curso.id_curso !== id_curso
      );
      setDatos(datos_nuevos);
      setError(null);
    } catch (error) {
      setError(error.mensaje || "No se pudo conectar al servidor");
      setDatos([]);
    }
  }

  // Manejo de estados de error y carga
  if (error !== null) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        No hay cursos disponibles
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de cursos
      </Typography>
      
      <Grid container spacing={3}>
        {datos.map((row) => (
          <Grid item xs={12} sm={6} md={4} key={row.id_curso}>
            <Card sx={{ maxWidth: 345, height: '100%' }}>
              <CardMedia
                sx={{ height: 140 }}
                image={row.imagen_url}
                title={row.titulo}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {row.titulo}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {row.precio}
                </Typography>
                <Typography variant="bovy2" sx={{color: "text.secondary"}}>
                    Plataforma: {row.plataforma?.nombre || "Sin plataforma"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                size="small" 
                component={Link} 
                to={`/cursos/edit/${row.id_curso}`}//
                >
                Editar
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  onClick={() => handleDelete(row.id_curso)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ListadoCardCursos;