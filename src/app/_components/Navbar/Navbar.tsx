// components/Navbar.tsx
"use client"; // Ensure this is a client component in Next.js 13+ (App Router)

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // for Next.js pages directory; if using App Router, import from 'next/navigation'
import Link from 'next/link';
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { UserToken } from '@/app/Context/UserToken'; // adjust path accordingly

const Navbar: React.FC = () => {
  const router = useRouter();
  const { userToken, setUserToken } = useContext(UserToken);
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted on the client
  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setUserToken(storedToken);
    }
  }, [setUserToken]);

  // Until mounted, avoid rendering dynamic parts to prevent hydration mismatch
  if (!mounted) {
    return null; // or a fallback/loading state
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    router.push('/login'); // adjust route as needed
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'brown' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Servers
          </Typography>
          {userToken ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/signup" passHref legacyBehavior>
                <Button color="inherit">Signup</Button>
              </Link>
              <Link href="/login" passHref legacyBehavior>
                <Button color="inherit">Login</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;


