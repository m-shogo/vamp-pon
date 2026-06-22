import { isStrictlyApprovedKnowledgeLine, launchCoreKnowledgeLines } from './knowledgeLines';

/** 通常の「言葉の記録」に掲載できる、厳格承認済み候補だけを返す。 */
export const collectionWordRecordLines = launchCoreKnowledgeLines.filter(isStrictlyApprovedKnowledgeLine);
