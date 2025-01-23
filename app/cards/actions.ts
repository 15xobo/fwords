'use server';

import { mongo } from "@/lib/mongo";

export interface WordEntry {
    word: string;
    word_translation: string;
    sentence: string;
    sentence_translation: string;
}

const prompt_prefix = "\
For each of the 10 Japanese words in [\
";

const prompt_suffix = "\
], print 3 lines literaly as described below: \
The first line is a sentence made with the word, quoting the word with square brackets. \
The second line is an English translation of the word. \
The third line is an English translation of the sentence, quoting the translation of the word with square brackets. \
No other lines in your answer so 30 lines in total. \
";

export async function generateData(user: string) {
    const selectedWords = await mongo.db("fwords").collection("words-jlpt-n5")
        .aggregate([
            { $sample: { size: 10 } },
            { $project: { word: true, _id: false } },
        ])
        .map((doc) => doc.word)
        .toArray();

    const prompt = prompt_prefix + selectedWords.map((word) => "\"" + word + "\"").join(", ") + prompt_suffix;
    console.log(prompt);

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
    if (lines.length != 30) {
        throw new Error("Generated bad data. " + lines.length + " lines. text: " + text);
    }
    for (let i = 0; i < 10; ++i) {
        const word = selectedWords[i];
        const sentence = lines[3 * i];
        const wordTranslation = lines[3 * i + 1];
        const sentenceTranslation = lines[3 * i + 2];
        const wordIndex = sentence.indexOf("[" + word + "]");
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

    const date = new Date().toISOString().substring(0, 10);
    const updateResult = await mongo.db("fwords").collection("user_words")
        .updateOne({ user, date }, { $setOnInsert: { words: words } }, { upsert: true });
    if (updateResult.upsertedCount !== 1) {
        throw "Failed to generate data";
    }
}

export async function getData(user: string, date: string): Promise<WordEntry[] | null> {
    const doc = await mongo.db("fwords").collection("user_words").findOne({ user, date });
    if (doc) {
        return doc.words;
    }
    return null;
}