import { importDataFromImage, ParsedDataFromImage } from './importFromImage';

export const importDataFromFreeImageHost = async (id: string): Promise<ParsedDataFromImage> => {
  const response = await fetch(`https://iili.io/${id}.png`);
  const imageBlob = await response.blob();
  return importDataFromImage(imageBlob);
}