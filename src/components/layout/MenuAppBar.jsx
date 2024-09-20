import * as React from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useAuth } from "../../auth/hooks/useAuth";

export const MenuAppBar = ({ user }) => {
  const [auth, setAuth] = React.useState(true);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = React.useState(null);
  const [appMenuAnchorEl, setAppMenuAnchorEl] = React.useState(null);
  const { login, handlerLogout } = useAuth();

  const navigate = useNavigate(); // Hook para navegar

  const handleAuthChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const handleAppMenuOpen = (event) => {
    setAppMenuAnchorEl(event.currentTarget);
  };

  const handleAppMenuClose = () => {
    setAppMenuAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path); // Navega hacia la ruta especificada
    handleAppMenuClose(); // Cierra el menú
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FormGroup>
        <FormControlLabel
          onClick={handlerLogout}
          control={
            <Switch
              checked={auth}
              onChange={handleAuthChange}
              aria-label="login switch"
            />
          }
          label={auth ? "Logout" : "Login"}
        />
      </FormGroup>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleAppMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            {`Nombre del cajero: ${login.user?.username || "No disponible"}`}
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAccountMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={accountMenuAnchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(accountMenuAnchorEl)}
                onClose={handleAccountMenuClose}
              >
                <MenuItem onClick={handlerLogout}>Cerrar</MenuItem>
              </Menu>
              {/* Menu para opciones adicionales */}
              <Menu
                id="app-menu"
                anchorEl={appMenuAnchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(appMenuAnchorEl)}
                onClose={handleAppMenuClose}
              >
                <MenuItem
                  onClick={() => handleMenuItemClick("/users/recharge")}
                >
                  Recarga de saldo al estudiante
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("/users/compras")}>
                  Venta de comida
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemClick("/users/products")}
                >
                  Productos
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemClick("/users/estudiantes")}
                >
                  Estudiantes
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick("/recargas/ReporteRecargasEstudiante")
                  }
                >
                  Reporte de Recargas
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick("/compras/ReporteEstudiante")
                  }
                >
                  Reporte de Ventas
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick("/users/padres")
                  }
                >
                  Crear Cuenta para Padres{" "}
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
