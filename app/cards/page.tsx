import { auth0 } from "@/lib/auth0";
import { mongo } from '@/lib/mongo';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlashCardDraw, { WordEntry } from './FlashCardDraw';

async function getData(userId: string, date: string): Promise<WordEntry[] | null> {
  const doc = await mongo.db("fwords").collection("user_words").findOne({ user: userId, date });
  if (!doc) {
    return null;
  }
  return doc.words;
}

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const session = await auth0.getSession();
  if (!session) {
    return <Typography variant="h6">Please log in</Typography>
  }

  const { date } = await searchParams;

  const canonicalDate = (!date || date === 'today') ? new Date().toISOString().substring(0, 10) : date;

  const data = await getData(session.user.email!, canonicalDate);
  if (!data) {
    return <Typography variant="h6">Failed to retrieve data</Typography>
  }

  console.log(data);
  return (
    <Stack direction="column" className="items-center">
      <FlashCardDraw data={data} />
    </Stack>
  )
}