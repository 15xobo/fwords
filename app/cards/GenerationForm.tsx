'use client';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateData } from "./actions";


export default function GenerationForm({
    user,
}: {
    user: string,
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGeneration = () => {
        setIsGenerating(true);
        generateData(user).finally(() => {
            router.refresh();
        });
    }

    if (isGenerating) {
        return (
            <Stack className="items-center">
                <CircularProgress />
                <br />
                <Typography variant="h6">
                    Generating data...
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack className="items-center">
            <Typography variant="h6">
                You don&apos;t have word data for today.
            </Typography>
            <br />
            <Button variant="contained" onClick={handleGeneration}>
                Generate Now
            </Button>
        </Stack>
    )
}