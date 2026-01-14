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

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import api from "../api";

function EditarPlataforma() {
  const navigate = useNavigate();
  const [plataforma, setPlataforma] = useState({
    name: "",
    birth_date: "",
    biography: "",
    photo_url: "",
  });
  const [isCamposValidos, setIsCamposValidos] = useState({
    name: true,
    birth_date: true,
    biography: true,
    photo_url: true,
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
    setPlataforma({ ...plataforma, [e.target.name]: e.target.value });
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
      name: true,
      birth_date: true,
      biography: true,
      photo_url: true,
    };

    // Validación del nombre
    if (plataforma.name.length < 10) {
      valido = false;
      objetoValidacion.name = false;
    }

    // Validación de la biografia
    if (plataforma.biography.length < 50) {
      valido = false;
      objetoValidacion.biography = false;
    }

    // Validación de la url de la photo
    if (!isValidURL(plataforma.photo_url)) {
      valido = false;
      objetoValidacion.photo_url = false;
    }

    // Validación de la fecha como requerida
    if (!plataforma.birth_date) {
      valido = false;
      objetoValidacion.birth_date = false;
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
                  value={plataforma.name}
                  onChange={handleChange}
                  error={!isCamposValidos.name}
                  helperText={
                    !isCamposValidos.name && "Compruebe el formato del nombre."
                  }
                />
              </Grid>
              <Grid item size={{ xs: 10 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DatePicker
                    label="Fecha de nacimiento"
                    name="birth_date"
                    minDate={dayjs("1800-01-01")}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        required: true,
                        error: !isCamposValidos.birth_date,
                        helperText: !isCamposValidos.birth_date
                          ? "La fecha es obligatoria"
                          : "",
                      },
                    }}
                    value={
                      plataforma.birth_date ? dayjs(plataforma.birth_date) : null
                    }
                    onChange={(newValue) =>
                      setPlataforma({
                        ...plataforma,
                        birth_date: newValue.format("YYYY-MM-DD"),
                      })
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="biography"
                  label="Biografía"
                  name="biography"
                  type="text"
                  multiline
                  maxRows={4}
                  minRows={2}
                  maxLength="500" // En este caso no coincide con el tamaño del campo en la BBDD
                  value={plataforma.biography}
                  onChange={handleChange}
                  error={!isCamposValidos.biography}
                  helperText={
                    !isCamposValidos.biography &&
                    "Compruebe el formato de la biografia."
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