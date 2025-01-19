import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function Home() {
  return (
    <Stack direction="column" className="items-center">
      <Link href="/cards">
        <IconButton size="large" color="primary">
          <PlayCircleOutlineIcon fontSize="large" />
        </IconButton>
      </Link>
      <br />
      <Typography variant="h6">
        Get some Chinese words to learn!
      </Typography>
    </Stack>
  );
}
