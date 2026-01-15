import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MovieTwoToneIcon from "@mui/icons-material/MovieTwoTone";
import { Link } from "react-router";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";

function Navbar() {
  const [anclaMenuPlataformas, setAnclaMenuPlataformas] = React.useState(null);
  const [anclaMenuCursos, setAnclaMenuCursos] = React.useState(null);
  const [anclaMenuXS, setAnclaMenuXS] = React.useState(null);

  
  const handleClickMenuPlataformas = (event) => {
    setAnclaMenuPlataformas(event.currentTarget);
  };
 
  const handleClickMenuCursos = (event) => {
    setAnclaMenuCursos(event.currentTarget);
  };

  const handleClickMenuXS = (event) => {
    setAnclaMenuXS(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnclaMenuPlataformas(null);
    setAnclaMenuCursos(null);
    setAnclaMenuXS(null);
  };

  const linkStyle = { color: "black", textDecoration: "none" };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Menú para resolución xs  */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu plataformas db resolucion xs"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleClickMenuXS}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-xs"
              anchorEl={anclaMenuXS}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuXS)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <ListSubheader>Menú Plataformas</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/plataformas/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de plataformas
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/plataformas" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de plataformas
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <ListSubheader>Menú Cursos</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/cursos/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de cursos
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/cursos" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de cursos
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo y nombre de la web */}
          <MovieTwoToneIcon />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mx: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            WEB E-LEARNING
          </Typography>

          {/* Menú para resolución md */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* Menú para plataformas en md */}
            <Button
              onClick={handleClickMenuPlataformas}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Plataformas
            </Button>
            <Menu
              id="menu-plataformas"
              anchorEl={anclaMenuPlataformas}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuPlataformas)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/plataformas/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de plataformas
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/plataformas" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de plataformas
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
            {/* Menú para cursos en md */}
            <Button
              onClick={handleClickMenuCursos}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Cursos
            </Button>
            <Menu
              id="menu-cursos"
              anchorEl={anclaMenuCursos}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuCursos)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/cursos/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de cursos
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/cursos" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de cursos
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
