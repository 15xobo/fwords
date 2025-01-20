'use client';

import { SessionData } from "@auth0/nextjs-auth0/server";
import MuiAppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from "next/link";
import { useState } from "react";

export default function AppBar({ session }: { session: SessionData | null }) {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    return (
        <MuiAppBar position="fixed">
            <Toolbar>
                <Box className="grow" />
                {session ?
                    <Box>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt={session!.user.name!} src={session!.user.picture} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorElUser}
                            keepMounted
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography component={Link} href="/auth/logout">Log out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    :
                    <Box>
                        <Button href="/auth/login" color="inherit">Log in with Google</Button>
                    </Box>}
            </Toolbar>
        </MuiAppBar>
    );
}
