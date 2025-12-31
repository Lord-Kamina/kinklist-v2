import { importDataFromImage, ParsedDataFromImage } from './importFromImage';

export const importDataFromImgur = async (id: string): Promise<ParsedDataFromImage> => {
  const response = await fetch(`https://i.imgur.com/${id}.png`);
  const imageBlob = await response.blob();
  return importDataFromImage(imageBlob);
}