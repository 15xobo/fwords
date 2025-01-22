'use client';

import { styled } from "@mui/material/styles";

export default styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar
}));
