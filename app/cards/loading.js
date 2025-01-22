import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function LoadingPage() {
    return (
        <Stack className="items-center">
            <CircularProgress />
            <br />
            <Typography variant="h6">
                Preparing...
            </Typography>
        </Stack>
    );
}