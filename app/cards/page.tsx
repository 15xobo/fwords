import { auth0 } from "@/lib/auth0";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlashCardDraw from './FlashCardDraw';
import { getData } from "./actions";

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const session = await auth0.getSession();
  if (!session) {
    return <Typography variant="h6">Please log in</Typography>
  }

  const { date = "today" } = await searchParams;

  const data = await getData(session.user.email!, date);
  if (!data) {
    return <Typography variant="h6">No data is found for {date}</Typography>
  }

  return (
    <Stack direction="column" className="items-center">
      <FlashCardDraw data={data} />
    </Stack>
  )
}