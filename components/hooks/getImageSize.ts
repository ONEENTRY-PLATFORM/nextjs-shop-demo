import https from 'https';
import { imageSize } from 'image-size';
import url from 'url';

const getImageSize = async (
  imgUrl: string,
): Promise<{ width: number; height: number }> => {
  const options = url.parse(imgUrl);

  return new Promise((resolve, reject) => {
    https
      .get(options, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to fetch image. Status code: ${response.statusCode}`,
            ),
          );
          response.resume(); // Consume response data to free up memory
          return;
        }
        const chunks: Uint8Array[] = [];
        let dimensions: { width?: number; height?: number } | null = null;

        response
          .on('data', (chunk) => {
            if (!dimensions) {
              chunks.push(chunk);
              try {
                dimensions = imageSize(Buffer.concat(chunks));

                if (dimensions.width && dimensions.height) {
                  resolve({
                    width: dimensions.width,
                    height: dimensions.height,
                  });
                  response.destroy();
                  // Stop further data reception
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {
                // If image-size throws an error due to insufficient data, continue receiving
              }
            }
          })
          .on('end', () => {
            if (!dimensions) {
              reject(new Error('Could not determine image dimensions'));
            }
          })
          .on('error', (err) => {
            reject(err);
          });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

export default getImageSize;
