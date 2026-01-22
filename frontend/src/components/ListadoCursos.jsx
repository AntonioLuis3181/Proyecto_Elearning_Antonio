import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import api from "../api";

function ListadoCursos() {
  const [datos, setDatos] = useState([]);
   
  const [busqueda, setBusqueda] = useState(""); 
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const getCursosFromApi = async () => {
    try {
      let queryParams = new URLSearchParams();
      if (busqueda) queryParams.append("busqueda", busqueda);
      if (fechaInicio) queryParams.append("fechaInicio", fechaInicio);
      if (fechaFin) queryParams.append("fechaFin", fechaFin);

      const url = `/cursos?${queryParams.toString()}`;
      
      const respuesta = await api.get(url);
      return respuesta.datos || [];
    } catch (error) {
      console.error("Error recuperando cursos:", error);
      return [];
    }
  };

  useEffect(() => {
    const cargaInicial = async () => {
        const resultados = await getCursosFromApi();
        setDatos(resultados);
    };
    cargaInicial();
  }, []); 

  const handleSearch = async () => {
    const resultados = await getCursosFromApi();
    setDatos(resultados);
  };

  async function handleDelete(id_curso) {
    if (window.confirm("¿Seguro que quieres borrar este curso?")) {
      try {
        await api.delete("/cursos/" + id_curso);
        setDatos((prevDatos) => prevDatos.filter((c) => c.id_curso !== id_curso));
      } catch (error) {
        console.error("Error al borrar", error);
      }
    }
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 3, mb: 3 }}>
        Listado de Cursos
      </Typography>

      <Grid container spacing={2} sx={{ justifyContent: "center", mb: 3, alignItems: "center" }}>
        
        <Grid item>
            <TextField 
                label="Título..." 
                variant="outlined" 
                size="small"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
        </Grid>

        <Grid item>
             <TextField
                label="Desde"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
            />
        </Grid>

        <Grid item>
             <TextField
                label="Hasta"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
            />
        </Grid>

        <Grid item>
            <Button 
                variant="contained" 
                startIcon={<SearchIcon />} 
                onClick={handleSearch}
            >
                Buscar
            </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mx: 2, width: 'auto', mb: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla cursos">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Fecha Pub.</TableCell> 
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">No hay datos</TableCell></TableRow>
            ) : (
                datos.map((row) => (
                <TableRow key={row.id_curso}>
                    <TableCell>{row.id_curso}</TableCell>
                    <TableCell>
                    {row.imagen_url && <img src={row.imagen_url} alt="Logo" width="40" style={{ borderRadius: '5px' }} />}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.titulo}</TableCell>
                    <TableCell>{row.plataforma ? row.plataforma.nombre : "Sin plataforma"}</TableCell>
                    <TableCell>{row.precio} €</TableCell>
                     
                    <TableCell>
                        {row.fecha_publicacion 
                            ? new Date(row.fecha_publicacion).toLocaleDateString() 
                            : '-'}
                    </TableCell>
                     
                    <TableCell align="center">
                    <IconButton component={Link} to={`/cursos/edit/${row.id_curso}`} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id_curso)} color="error">
                        <DeleteIcon />
                    </IconButton>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ListadoCursos;