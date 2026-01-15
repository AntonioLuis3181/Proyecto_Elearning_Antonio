import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid"; 
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem"; 
import Select from "@mui/material/Select";     
import InputLabel from "@mui/material/InputLabel"; 
import FormControl from "@mui/material/FormControl"; 

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

import api from "../api";

function AltaCurso() {
  const navigate = useNavigate();

  const [curso, setCurso] = useState({
    titulo: "",
    precio: "",
    horas: "",
    fecha_publicacion: new Date().toISOString().split('T')[0], 
    imagen_url: "",
    id_plataforma: "" 
  });


  const [listaPlataformas, setListaPlataformas] = useState([]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");


  useEffect(() => {
    async function fetchPlataformas() {
      try {
        const respuesta = await api.get("/plataformas");
        
        if(respuesta.datos) {
            setListaPlataformas(respuesta.datos);
        }
      } catch (error) {
        console.error("Error cargando plataformas", error);
      }
    }
    fetchPlataformas();
  }, []);

  useEffect(() => {
    async function fetchCreateCurso() {
      try {
        // Hacemos el POST a /cursos
        const respuesta = await api.post("/cursos/", curso);
        
        setDialogMessage(respuesta.mensaje || "Curso creado correctamente");
        setDialogSeverity("success");
        setOpenDialog(true);
      } catch (error) {
        setDialogMessage(error.mensaje || "Error al crear el curso");
        setDialogSeverity("error");
        setOpenDialog(true);
      }
      setIsUpdating(false);
    }

    if (isUpdating) fetchCreateCurso();
  }, [isUpdating,]);

  function handleChange(e) {
    setCurso({ ...curso, [e.target.name]: e.target.value });
  }

  function handleClick() {
    if (isUpdating) return;
    if (validarDatos()) {
      setIsUpdating(true);
    }
  }

  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/cursos");
  }

  function validarDatos() {

    if (!curso.titulo || curso.titulo.length < 3) {
       alert("El título es muy corto"); 
       return false;
    }
    if (!curso.id_plataforma) {
        alert("Debes seleccionar una plataforma");
        return false;
    }

    if(curso.precio < 0.00) {
        alert("El precio no puede ser negativo")
    }
    return false;
  }

  return (
    <>
      <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
        <Grid item xs={12} sm={9} md={7}>
          <Paper elevation={6} sx={{ mt: 3, p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Alta de Curso
            </Typography>

            <Grid container spacing={2}>
              
              {/* CAMPO: TÍTULO */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Título del curso"
                  name="titulo"
                  value={curso.titulo}
                  onChange={handleChange}
                />
              </Grid>

              {/* CAMPO: PRECIO */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio (€)"
                  name="precio"
                  type="number"
                  InputProps={{ inputProps: {min: 0} }}
                  value={curso.precio}
                  onChange={handleChange}
                />
              </Grid>

              {/* CAMPO: HORAS */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Horas"
                  name="horas"
                  type="number"
                  InputProps={{ inputProps: {min: 0} }}
                  value={curso.horas}
                  onChange={handleChange}
                />
              </Grid>

              {/* CAMPO: FECHA PUBLICACIÓN */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Publicación"
                  name="fecha_publicacion"
                  type="date"
                  value={curso.fecha_publicacion}
                  onChange={handleChange}
                />
              </Grid>

              {/* CAMPO: URL IMAGEN */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="URL Imagen (Logo)"
                  name="imagen_url"
                  value={curso.imagen_url}
                  onChange={handleChange}
                />
              </Grid>

              {/* CAMPO: SELECT DE PLATAFORMA */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="plataforma-label">Plataforma</InputLabel>
                  <Select
                    labelId="plataforma-label"
                    name="id_plataforma"
                    value={curso.id_plataforma}
                    label="Plataforma"
                    onChange={handleChange}
                  >
                    {/* Aquí iteramos las plataformas que cargamos de la API */}
                    {listaPlataformas.map((p) => (
                        <MenuItem key={p.id_plataforma} value={p.id_plataforma}>
                            {p.nombre}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* BOTÓN ACEPTAR */}
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={isUpdating}
                  onClick={handleClick}
                >
                  {isUpdating ? "Guardando..." : "Crear Curso"}
                </Button>
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{dialogSeverity === "success" ? "¡Éxito!" : "Error"}</DialogTitle>
        <DialogContent dividers>
          <Alert severity={dialogSeverity}>{dialogMessage}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AltaCurso;