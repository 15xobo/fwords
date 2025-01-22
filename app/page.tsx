import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function Home() {
  return (
    <Stack direction="column" className="items-center">
      <Typography variant="h6">
        Check out words to learn today!
      </Typography>
      <br />
      <Link href="/cards?date=today">
        <Button variant="contained" endIcon={<PlayCircleOutlineIcon />}>Go</Button>
      </Link>
    </Stack>
  );
}
