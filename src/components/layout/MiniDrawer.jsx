import { styled, useTheme } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HandymanIcon from "@mui/icons-material/Handyman";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListIcon from "@mui/icons-material/List";
import ListItemText from "@mui/material/ListItemText";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import QuizIcon from "@mui/icons-material/Quiz";
import Logo from "../../images/logoflosamed.png"; // Ajusta la ruta a tu imagen de logotipo

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import IconButton from "@mui/material/IconButton";
import { AccountCircle, LineAxis } from "@mui/icons-material";

import {
  AccountTree,
  Addchart,
  Apartment,
  AppRegistration,
  BrandingWatermark,
  BrandingWatermarkRounded,
  EmojiPeople,
  FireplaceSharp,
  FmdGood,
  LibraryBooks,
  People,
  RequestQuote,
} from "@mui/icons-material";

//import { makeStyles } from '@mui/styles';
// ... (componentes previos)

const useStyles = styled((theme) => ({
  listItemHover: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerImage: {
    maxWidth: "100%",
    height: "auto",
  },
  customDivider: {
    borderBottom: "1px solid #ccc", // Puedes ajustar el color y el estilo de la línea según tus preferencias
    margin: theme.spacing(2, 0), // Puedes ajustar el margen según tus preferencias
  },
  chartContainer: {
    height: "80vh", // Ajusta según sea necesario
    width: "80%", // Ajusta según sea necesario
  },
}));

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const MiniDrawer = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Define el tema oscuro con un color específico para los iconos
  const darkTheme = createTheme({
    palette: {
      type: "dark", // Indica que es un tema oscuro
      primary: {
        main: "#9AE6F0", // Puedes ajustar el color principal
      },
      background: {
        paper: "#363636", // Puedes ajustar el color de fondo del Drawer
      },
      text: {
        primary: theme.palette.common.white, // Color de texto principal
      },
      icon: {
        main: theme.palette.common.white, // Color de iconos
      },
    },
  });
  const classes = useStyles(theme);

  const { login, handlerLogout } = useAuth();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          style={{ backgroundColor: "#000" }}
        >
          <Toolbar>
            <IconButton
              color="primary"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo en la AppBar */}
            <Typography variant="h6" noWrap style={{ color: "white" }}>
              <img
                src={Logo}
                alt="Logo"
                style={{ marginRight: "10px", height: "40px" }}
              />
              CEDEH - Cafeteria
            </Typography>

            <div style={{ marginLeft: "auto" }}>
              {/* Agrega un icono de cierre de sesión en la AppBar */}
              <IconButton style={{ color: "white" }} onClick={handlerLogout}>
                <ExitToAppIcon />
                <Typography
                  variant="body1"
                  style={{ marginLeft: "5px", color: "white" }}
                >
                  Cerrar Sesión
                </Typography>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} style={{ marginLeft: "16px" }}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon color="primary" />
              ) : (
                <ChevronLeftIcon color="primary" />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ my: 0.5 }} />

          <List>

            <ListItem
              component={NavLink}
              to="/proveedores"
              className={classes.listItemHover}
            >
              <ListItemIcon>
                <SupervisorAccountIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                color="primary"
                primary="Proveedores"
                primaryTypographyProps={{ style: { color: "#9AE6F0" } }} // Cambiar el color del texto
              />
            </ListItem>
            <ListItem component={NavLink} to="/fabricantes">
              <ListItemIcon>
                <EditNoteIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Fabricantes/Marcas"
                primaryTypographyProps={{ style: { color: "#9AE6F0" } }} // Cambiar el color del texto
              />
            </ListItem>
            <ListItem component={NavLink} to="/AssetDash/Dashboard">
              <ListItemIcon>
                <LineAxis color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Tablero"
                primaryTypographyProps={{ style: { color: "#9AE6F0" } }} // Cambiar el color del texto
              />
            </ListItem>
            <ListItem
              component={NavLink}
              to="/activos"
              className={classes.listItemHover}
            >
              <ListItemIcon>
                <RequestQuote color="primary" />
              </ListItemIcon>
              <ListItemText
                color="primary"
                primary="Activos"
                primaryTypographyProps={{ style: { color: "#9AE6F0" } }} // Cambiar el color del texto
              />
            </ListItem>
            <ListItem component={NavLink} to="/movimientos">
              <ListItemIcon>
                <EngineeringIcon color="primary" />
                {/* <HandymanIcon color="primary" /> */}
              </ListItemIcon>
              <ListItemText
                // primary="Mantenimiento"
                primary="Movimiento de activo"
                primaryTypographyProps={{ style: { color: "#9AE6F0" } }} // Cambiar el color del texto
              />
            </ListItem>
            

            <ListItem component={NavLink} to="/users">
              <ListItemIcon>
                <EmojiPeople color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Usuarios"
                primaryTypographyProps={{ style: { color: "#9AE6F0" } }} // Cambiar el color del texto
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 0.5 }} />
          <List>
            <Divider />
            <ListItem onClick={handlerLogout}>
              <ListItemIcon>
                <AccountCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={login.user?.username?.toUpperCase()}
                primaryTypographyProps={{ style: { color: "#9AE6F0" } }} // Cambiar el color del texto
              />
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};
