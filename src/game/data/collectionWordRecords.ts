import { isCommerciallySafeKnowledgeLine, launchCoreKnowledgeLines } from './knowledgeLines';

/** 通常の「言葉の記録」に掲載できる、商用確認済み候補だけを返す。 */
export const collectionWordRecordLines = launchCoreKnowledgeLines.filter(isCommerciallySafeKnowledgeLine);
