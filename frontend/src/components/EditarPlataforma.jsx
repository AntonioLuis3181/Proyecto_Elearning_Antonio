import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

import api from "../api";

function EditarPlataforma() {
  const navigate = useNavigate();
  const [plataforma, setPlataforma] = useState({
    nombre: "",
    url_web: "",
    es_gratuita: "",
  });
  const [isCamposValidos, setIsCamposValidos] = useState({
    nombre: true,
    url_web: true,
    es_gratuita: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");
  const { id_plataforma } = useParams();

  useEffect(() => {
    async function fetchUpdatePlataforma() {
      try {
        await api.put(`/plataformas/${id_plataforma}`, plataforma);
        
        setDialogMessage("Actualización correcta del plataforma"); // Mensaje
        setDialogSeverity("success"); // Color verde
        setOpenDialog(true); // Abrir el diálogo
      } catch (error) {
        setDialogMessage(error.mensaje || "Error al actualizar el plataforma");
        setDialogSeverity("error"); // Color rojo
        setOpenDialog(true); // Abrir el diálogo
      }
      // Pase lo que pase hemos terminado el proceso de actualización
      setIsUpdating(false);
    }

    if (isUpdating) fetchUpdatePlataforma();
  }, [isUpdating]);

  useEffect(() => {
    async function fetchPlataforma() {
      try {
        const respuesta = await api.get(`/plataformas/${id_plataforma}`);

        setPlataforma(respuesta.datos);

      } catch (error) {
        setDialogMessage(error.mensaje || "Error al recuperar los datos del plataforma");
        setDialogSeverity("error"); // Color rojo
        setOpenDialog(true); // Abrir el diálogo
      }
    }

    fetchPlataforma();
  }, [id_plataforma]);

  function handleChange(e) {
    setPlataforma({ ...plataforma, [e.target.nombre]: e.target.value });
  }

  function handleClick() {
    // evitar envíos duplicados por pulsar el botón tras el mensaje de inserción correcta
    if (isUpdating) return;

    if (validarDatos()) {
      setIsUpdating(true);
    }
  }

  function handleDialogClose() {
    setOpenDialog(false);

    if (dialogSeverity === "success") navigate("/");
  }

  function validarDatos() {
    let valido = true;
    let objetoValidacion = {
      nombre: true,
      url_web: true,
      es_gratuita: true,
    };

    // Validación del nombre
    if (plataforma.nombre.length < 10) {
      valido = false;
      objetoValidacion.nombre = false;
    }

    // Validación de la url de la photo
    if (!isValidURL(plataforma.url_web)) {
      valido = false;
      objetoValidacion.url_web = false;
    }

    // Validación de la fecha como requerida
    if (!plataforma.es_gratuita) {
      valido = false;
      objetoValidacion.es_gratuita = false;
    }
    // Actualizamos con los campos correctos e incorrectos
    setIsCamposValidos(objetoValidacion);

    return valido;
  }

  const isValidURL = (urlString) => {
    var patronURL = new RegExp(
      // valida protocolo
      "^(https?:\\/\\/)?" +
        // valida nombre de dominio
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        // valida OR direccion ip (v4)
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        // valida puerto y path
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        // valida queries
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        // valida fragment locator
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!patronURL.test(urlString);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item size={{ xs: 12, sm: 9, md: 7 }}>
          <Paper elevation={6} sx={{ mt: 3, p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Editar plataforma
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Nombre"
                  name="name"
                  type="text"
                  maxLength="100" // Coincide con el tamaño del campo en la BBDD
                  value={plataforma.nombre}
                  onChange={handleChange}
                  error={!isCamposValidos.nombre}
                  helperText={
                    !isCamposValidos.nombre && "Compruebe el formato del nombre."
                  }
                />
              </Grid>
                            <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="photo_url"
                  label="URL de la fotografía"
                  name="photo_url"
                  type="text"
                  maxLength="255" // Coincide con el tamaño del campo en la BBDD
                  value={plataforma.photo_url}
                  onChange={handleChange}
                  error={!isCamposValidos.photo_url}
                  helperText={
                    !isCamposValidos.photo_url &&
                    "Compruebe el formato de la URL de la fotografía."
                  }
                />
              </Grid>
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="es_gratuita"
                  label="es_gratuita"
                  name="es_gratuita"
                  type="int"
                  multiline
                  maxRows={4}
                  minRows={2}
                  maxLength="500" // En este caso no coincide con el tamaño del campo en la BBDD
                  value={plataforma.es_gratuita}
                  onChange={handleChange}
                  error={!isCamposValidos.es_gratuita}
                  helperText={
                    !isCamposValidos.es_gratuita &&
                    "Compruebe si es gratuita."
                  }
                />
              </Grid>

              <Grid
                item
                size={{ xs: 10 }}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  loading={isUpdating}
                  loadingPosition="end"
                  onClick={handleClick}
                >
                  Aceptar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        disableEscapeKeyDown
        aria-labelledby="result-dialog-title"
      >
        <DialogTitle id="result-dialog-title">
          {dialogSeverity === "success" ? "Operación correcta" : "Error"}
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity={dialogSeverity} variant="filled">
            {dialogMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditarPlataforma;