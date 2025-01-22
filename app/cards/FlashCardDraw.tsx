
'use client';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ReplayIcon from '@mui/icons-material/Replay';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from "@mui/material/ListItem";
import ListItemText from '@mui/material/ListItemText';
import MobileStepper from '@mui/material/MobileStepper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export interface WordEntry {
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

function FlashCard({ data, flipped, onClick }: { data: WordEntry, flipped: boolean, onClick: () => void }) {
  const sentence = parseSentence(data.sentence);
  const translatedSentence = parseSentence(data.sentence_translation);

  return (
    <Card
      className='w-96 h-96 flex items-center'
      onClick={onClick}
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

export default function FlashCardDraw({ data }: { data: WordEntry[] }) {
  const [viewing, setViewing] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  function handleNextButtonClick() {
    setFlipped(false);
    if (index == data.length - 1) {
      setViewing(true);
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }

  return (
    viewing ?
      <Stack direction="column">
        <WordList data={data} />
        <Button startIcon={<ReplayIcon />} onClick={() => setViewing(false)}>Replay</Button>
      </Stack>
      :
      <Stack direction="column">
        <FlashCard
          data={data[index]}
          flipped={flipped}
          onClick={() => setFlipped(!flipped)}
        />
        <MobileStepper
          variant="text"
          steps={data.length}
          position="static"
          activeStep={index}
          nextButton={
            <Button
              size="small"
              onClick={handleNextButtonClick}
            >
              {index == data.length - 1 ? "Finish" : "Next"}
              <KeyboardArrowRightIcon />
            </Button>
          }
          backButton={null}
        />
      </Stack>
  )
}