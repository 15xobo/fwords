import Stack from '@mui/material/Stack';
import FlashCardDraw, { WordEntry } from './FlashCardDraw';

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

export default async function CardsPage() {
  const data = await getData();
  return (
    <Stack direction="column" className="items-center">
      <FlashCardDraw data={data} />
    </Stack>
  )
}