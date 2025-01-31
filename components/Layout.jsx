import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, Box, CssBaseline } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const handleItemClick = (path) => {
    router.push(path);
    setOpen(false);  // Close the drawer when an item is clicked
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Justin Kuo Posthog Demo
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <List>
          <ListItem button component={Link} href="/" onClick={() => handleItemClick('/')}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} href="/users" onClick={() => handleItemClick('/users')}>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} href="/events" onClick={() => handleItemClick('/events')}>
            <ListItemText primary="Events" />
          </ListItem>
          <ListItem button component={Link} href="/visualization" onClick={() => handleItemClick('/visualization')}>
            <ListItemText primary="Visualization" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: (theme) => theme.palette.background.default,
          paddingTop: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
