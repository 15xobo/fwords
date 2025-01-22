'use server';

import { mongo } from "@/lib/mongo";

export async function getUserHistoryDates(user: string): Promise<string[]> {
    return mongo.db("fwords").collection("user_words").aggregate([
        { $match: { user } },
        { $project: { date: true, _id: false } },
        { $sort: { date: -1 } },
        { $limit: 10 }
    ])
        .map((doc) => doc.date).toArray();
}