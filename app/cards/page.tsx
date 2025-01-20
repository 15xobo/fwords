import { auth0 } from "@/lib/auth0";
import { mongo } from '@/lib/mongo';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlashCardDraw, { WordEntry } from './FlashCardDraw';

async function getData(userId: string): Promise<WordEntry[] | null> {
  const doc = await mongo.db("fwords").collection("user_words").findOne({ user: userId, date: "2025-01-20" });
  if (!doc) {
    return null;
  }
  return doc.words;
}

export default async function CardsPage() {
  const session = await auth0.getSession();
  if (!session) {
    return <Typography variant="h6">Please log in</Typography>
  }
  console.log(session.user.email)
  const data = await getData(session.user.email!);
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