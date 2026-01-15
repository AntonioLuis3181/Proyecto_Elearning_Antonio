// ============================================
// IMPORTACIONES
// ============================================
const express = require("express");
const path = require("path");
const cors = require("cors");
const { logMensaje } = require("./utils/logger.js");

// Rutas de la API
const plataformaRoutes = require("./routes/plataformaRoutes");
const cursoRoutes = require("./routes/cursoRoutes");

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express();
const port = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE - PARSEO
// ============================================
app.use(express.json());

// ============================================
// MIDDLEWARE - CORS - Cualquier origen
// ============================================
app.use(cors());

// ============================================
// MIDDLEWARE - ARCHIVOS ESTÁTICOS
// ============================================
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// RUTAS - API REST
// ============================================
app.use("/api/plataformas", plataformaRoutes);
app.use("/api/cursos",cursoRoutes);

// ============================================
// RUTAS - SPA (Catch-all)
// ============================================
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// ============================================
// SERVIDOR
// ============================================
app.listen(port, () => {
  logMensaje(`Servidor escuchando en el puerto ${port}`);
});
