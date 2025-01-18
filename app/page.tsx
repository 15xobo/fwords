'use client';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from "@mui/material/ListItem";
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface WordEntry {
  word: string;
  word_translation: string;
  sentence: string;
  sentence_translation: string;
}

interface ThreePartSentence {
  prefix: string;
  word: string;
  suffix: string;
}

async function getData(): Promise<WordEntry[]> {
  await new Promise(r => setTimeout(r, 2000));
  return [
    { "word": "爱好", "word_translation": "hobby", "sentence": "我的[[爱好]]是看书。", "sentence_translation": "My [[hobby]] is reading books." },
    { "word": "结束", "word_translation": "to end", "sentence": "会议已经[[结束]]了。", "sentence_translation": "The meeting has already [[ended]]." },
    { "word": "环境", "word_translation": "environment", "sentence": "我们应该保护[[环境]]。", "sentence_translation": "We should protect the [[environment]]." },
    { "word": "检查", "word_translation": "to examine", "sentence": "医生正在[[检查]]我的身体。", "sentence_translation": "The doctor is [[examining]] my body." },
    { "word": "继续", "word_translation": "to continue", "sentence": "请你[[继续]]说下去。", "sentence_translation": "Please [[continue]] speaking." },
    { "word": "了解", "word_translation": "to understand", "sentence": "你[[了解]]他的意思吗？", "sentence_translation": "Do you [[understand]] his meaning?" },
    { "word": "美丽", "word_translation": "beautiful", "sentence": "这个花园很[[美丽]]。", "sentence_translation": "This garden is very [[beautiful]]." },
    { "word": "努力", "word_translation": "hardworking", "sentence": "他是一个很[[努力]]的学生。", "sentence_translation": "He is a very [[hardworking]] student." },
    { "word": "生气", "word_translation": "angry", "sentence": "他昨天很[[生气]]。", "sentence_translation": "He was very [[angry]] yesterday." },
    { "word": "遇到", "word_translation": "to encounter", "sentence": "我今天在路上[[遇到]]了我的朋友。", "sentence_translation": "I [[encountered]] my friend on the road today." }
  ];
}

const wordPartRe = /^(.*)\[\[(.*)\]\](.*)$/;

function parseSentence(sentence: string): ThreePartSentence {
  const matchResult = sentence.match(wordPartRe);
  return matchResult && matchResult?.length == 4 ?
    {
      prefix: matchResult[1],
      word: matchResult[2],
      suffix: matchResult[3]
    }
    :
    { prefix: '', word: '', suffix: '' };
}

function Sentence({ sentence }: { sentence: ThreePartSentence }) {
  return (
    <span>
      <Typography component="span">{sentence.prefix}</Typography>
      <Typography component="span" color="error">{sentence.word}</Typography>
      <Typography component="span">{sentence.suffix}</Typography>
    </span>
  );
}

function WordList({ data }: { data: WordEntry[] }) {
  return (
    <List>
      {data.map((item, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={item["word"] + ' ' + item["word_translation"]}
            secondary={
              <span>
                <Sentence sentence={parseSentence(item["sentence"])} />
                <br />
                <Sentence sentence={parseSentence(item["sentence_translation"])} />
              </span>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

function FlashCard({ data }: { data: WordEntry }) {
  const [flipped, setFlipped] = useState(false);

  const sentence = parseSentence(data.sentence);
  const translatedSentence = parseSentence(data.sentence_translation);

  return (
    <Card
      className='w-96 h-96 flex items-center'
      onClick={() => setFlipped(!flipped)}
    >
      <CardContent sx={{ inlineSize: '100%', textAlign: 'center' }}>
        <Sentence sentence={flipped ? sentence : { ...sentence, word: "?".repeat(sentence.word.length) }} />
        <br />
        <br />
        <Sentence sentence={translatedSentence} />
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [data, setData] = useState<WordEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    getData().then(data => {
      setData(data);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Stack direction="column" className="items-center justify-center flex flex-col h-screen w-screen">
      {data ? <FlashCard data={data[0]} /> :
        <Stack direction="row" className="flex items-center">
          <IconButton loading={loading} onClick={fetchData}>
            <PlayCircleOutlineIcon />
          </IconButton>
          Get some Chinese words to learn!
        </Stack>
      }
    </Stack>
  );
}
