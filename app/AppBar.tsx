'use client';

import { SessionData } from "@auth0/nextjs-auth0/server";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from "@mui/material/styles";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserHistoryDates } from "./actions";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


export default function AppBar({ session }: { session: SessionData | null }) {
    const [userHistoryDates, setUserHistoryDates] = useState<null | string[]>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const user = session?.user.email;
    useEffect(() => {
        if (user) {
            getUserHistoryDates(user).then((dates) => {
                const dateToday = new Date().toISOString().substring(0, 10);
                if (dates.length !== 0 && dates[0] === dateToday) {
                    dates = dates.slice(1, dates.length);
                }
                setUserHistoryDates(dates);
            });
        }
        return () => {
            setUserHistoryDates(null);
        }
    }, [user]);

    const handleOpenDrawer = () => {
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <MuiAppBar position="fixed" >
            <Toolbar className={drawerOpen ? "ml-40" : ""}>
                <Box className={drawerOpen ? "hidden" : ""}>
                    <IconButton
                        color="inherit"
                        onClick={handleOpenDrawer}
                        edge="start"

                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Link href="/"><Button color="inherit">FWords</Button></Link>
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
            <Drawer PaperProps={{ className: "w-40" }}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
            >
                <DrawerHeader >
                    <IconButton onClick={handleCloseDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List subheader={<ListSubheader>History</ListSubheader>}>
                    <ListItemButton key="today">
                        <ListItemText primary="Today" />
                    </ListItemButton>
                    {userHistoryDates && userHistoryDates.map((date) => (
                        <ListItemButton key={date}>
                            <ListItemText primary={date} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
        </MuiAppBar>
    );
}
