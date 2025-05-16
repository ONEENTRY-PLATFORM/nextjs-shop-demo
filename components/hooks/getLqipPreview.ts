import lqipModern from 'lqip-modern';

const getLqipPreview = async (imageUrl: string) => {
  const image = await fetch(imageUrl);
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const previewImage = await lqipModern(imageBuffer);

  return previewImage.metadata.dataURIBase64;
};

export default getLqipPreview;
