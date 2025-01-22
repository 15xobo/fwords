import { auth0 } from "@/lib/auth0";
import { mongo } from '@/lib/mongo';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlashCardDraw, { WordEntry } from './FlashCardDraw';

const prompt = "\
Select a 10 Chinese words at HSK level 4. \
For each word, do the following steps. \
Make a sentence with the word. \
Print the word only in the first line. \
Print its English translation in the second line. \
Print the sentence with the word quoted with double square brackets in the third line. \
rint the English translation of the sentence with the translation of the word quoted with double square brackets in the fourth line. \
Do not print any other lines. \
Do not print empty lines.\
Make sure to use double brackets.";

async function generateData(): Promise<WordEntry[]> {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key="
    + process.env.GENIMI_API_KEY!,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "contents": [{ "parts": [{ "text": prompt }] }]
      }),
    });
  const responseBody = await response.json();

  const words: WordEntry[] = [];
  const text = responseBody.candidates[0].content.parts[0].text
  const lines = text.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
  if (lines.length != 40) {
    throw new Error("Generated bad data. " + lines.length + " lines. text: " + text);
  }
  for (let i = 0; i < 40; i += 4) {
    const word = lines[i];
    const wordTranslation = lines[i + 1];
    const sentence = lines[i + 2];
    const sentenceTranslation = lines[i + 3];
    const wordIndex = sentence.indexOf("[[" + word + "]]");
    if (wordIndex === -1) {
      throw new Error("Generated bad data. " + wordIndex + " " + word + " " + wordTranslation + " " + sentence + " " + sentenceTranslation);
    }
    words.push({
      word: word,
      word_translation: wordTranslation,
      sentence: sentence,
      sentence_translation: sentenceTranslation,
    });
  }
  return words;
}

async function getData(userId: string, date: string): Promise<WordEntry[] | null> {
  const canonicalDate = date === "today" ? new Date().toISOString().substring(0, 10) : date;
  const doc = await mongo.db("fwords").collection("user_words").findOne({ user: userId, date: canonicalDate });
  if (doc) {
    return doc.words;
  }
  if (date !== "today") {
    return null;
  }

  const data = await generateData();
  const updateResult = await mongo.db("fwords").collection("user_words")
    .updateOne({ user: userId, date: canonicalDate }, { $setOnInsert: { words: data } }, { upsert: true });
  if (updateResult.modifiedCount === 1) {
    throw "Failed to generate data"
  }
  return data;
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