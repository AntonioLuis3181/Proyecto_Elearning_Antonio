import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import api from "../api";

function ListadoCardPlataformas() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlataformas() {
      try {
        const respuesta = await api.get("/plataformas/");
        setDatos(respuesta.datos);
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
      const datos_nuevos = datos.filter(
        (plataforma) => plataforma.id_plataforma !== id_plataforma
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
        No hay plataformas disponibles
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de plataformas
      </Typography>
      
      <Grid container spacing={3}>
        {datos.map((row) => (
          <Grid item xs={12} sm={6} md={4} key={row.id_plataforma}>
            <Card sx={{ maxWidth: 345, height: '100%' }}>
              <CardMedia
                sx={{ height: 140 }}
                image={row.url_web}
                title={row.nombre}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {row.nombre}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {row.es_gratuita}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Compartir</Button>
                <Button size="small">Ver más</Button>
                <Button 
                  size="small" 
                  color="error"
                  onClick={() => handleDelete(row.id_plataforma)}
                >
                  Eliminar
                </Button>
              </CardActions>
              <Link to={'/plataformas/edit/$row.plataforma'}>
                
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ListadoCardPlataformas;