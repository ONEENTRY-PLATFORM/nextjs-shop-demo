import https from 'https';
import { imageSize } from 'image-size';
import url from 'url';

/**
 * Asynchronously retrieves the dimensions (width and height) of an image from a URL
 *
 * This function fetches an image from the provided URL and determines its dimensions
 * without downloading the entire image. It uses the image-size library to parse
 * the image header and extract width and height information.
 * @param   {string}                                     imgUrl - The URL of the image to analyze
 * @returns {Promise<{ width: number; height: number }>}        A promise that resolves to an object containing width and height properties
 * @throws {Error} if the image cannot be fetched or dimensions cannot be determined
 * @example
 * ```typescript
 * const { width, height } = await getImageSize('https://example.com/image.jpg');
 * console.log(`Image dimensions: ${width}x${height}`);
 * ```
 */
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
