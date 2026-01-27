import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PublicIcon from '@mui/icons-material/Public';
import api from "../api";

function ListadoPlataformasDataGrid() {
  const [rows, setRows] = useState([]);

  // 1. CARGA DE DATOS
  useEffect(() => {
    async function fetchData() {
      try {
        // Pedimos un límite alto para tener todos los datos en el cliente
        // y que el DataGrid pueda ordenar y filtrar todo.
        const respuesta = await api.get("/plataformas?limit=100");
        setRows(respuesta.datos || []);
      } catch (error) {
        console.error("Error cargando plataformas:", error);
      }
    }
    fetchData();
  }, []);

  // 2. DEFINICIÓN DE COLUMNAS
  const columns = [
    { field: "id_plataforma", headerName: "ID", width: 70 },
    
    { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 150 },
    
    // Columna URL con icono y enlace clickable
    { 
      field: "url_web", 
      headerName: "Sitio Web", 
      width: 200,
      renderCell: (params) => {
        // Si no hay URL, no mostramos nada
        if (!params.value) return "-";
        
        return (
          <a 
            href={params.value} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#1976d2' }}
          >
            <PublicIcon fontSize="small" sx={{ mr: 1 }} />
            Visitar
          </a>
        );
      }
    },

    // Columna Booleana (Gratis vs Pago) visual
    { 
      field: "es_gratuita", 
      headerName: "Tipo", 
      width: 130,
      renderCell: (params) => {
        // params.value será true (1) o false (0)
        return (
           <Chip 
             label={params.value ? "Gratis" : "De Pago"} 
             color={params.value ? "success" : "warning"} 
             variant="outlined" 
             size="small" 
           />
        );
      }
    },

    // Columna Fecha
    { 
      field: "fecha_alta", 
      headerName: "Fecha Alta", 
      width: 150,
      valueFormatter: (value) => {
         if(!value) return "-";
         return new Date(value).toLocaleDateString();
      }
    },
  ];

  return (
    <Paper sx={{ height: 600, width: "100%", p: 2, mt: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Plataformas (DataGrid)
      </Typography>
      
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id_plataforma} // <--- ¡IMPORTANTE! La ID es id_plataforma
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{ toolbar: GridToolbar }} // Barra de herramientas (Filtros, Exportar...)
        disableRowSelectionOnClick
      />
    </Paper>
  );
}

export default ListadoPlataformasDataGrid;