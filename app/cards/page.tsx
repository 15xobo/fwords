import { auth0 } from "@/lib/auth0";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getData } from "./actions";
import FlashCardDraw from './FlashCardDraw';
import GenerationForm from "./GenerationForm";

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const [session, { date = "today" }] = await Promise.all([auth0.getSession(), searchParams]);
  if (!session) {
    return <Typography variant="h6">Please log in</Typography>
  }
  const user = session.user.email!;

  const data = await getData(user, date === "today" ? new Date().toISOString().substring(0, 10) : date);
  if (!data) {
    return <GenerationForm user={user} />
  }

  return (
    <Stack direction="column" className="items-center">
      <FlashCardDraw data={data} />
    </Stack>
  )
}