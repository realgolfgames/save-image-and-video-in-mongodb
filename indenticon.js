import crypto from 'crypto';
import fs from 'fs';
import jpeg from 'jpeg-js';

// Function to generate identicon as raw image data
function generateIdenticonData(username, email) {
  // Create a hash of the username and email
  const hash = crypto.createHash('md5').update(username + email).digest('hex');

  const gridSize = 10; // 10x10 grid
  const imageSize = 500; // Image size in pixels (500x500 for a 10x10 grid with each cell being 50x50 pixels)
  const squareSize = imageSize / gridSize; // Size of each square in pixels
  const width = imageSize;
  const height = imageSize;

  // Create a buffer for the image data
  const frameData = Buffer.alloc(width * height * 4); // RGBA format

  // Main color (white)
  const mainColor = { r: 255, g: 255, b: 255 };

  // Pattern color (use hash to determine pattern color)
  const patternColor = {
    r: parseInt(hash.substring(0, 2), 16),
    g: parseInt(hash.substring(2, 4), 16),
    b: parseInt(hash.substring(4, 6), 16),
  };

  // Fill the background with white color
  for (let i = 0; i < frameData.length; i += 4) {
    frameData[i] = mainColor.r;      // Red channel
    frameData[i + 1] = mainColor.g;  // Green channel
    frameData[i + 2] = mainColor.b;  // Blue channel
    frameData[i + 3] = 255; // Alpha channel (fully opaque)
  }

  // Draw the pattern
  for (let x = 0; x < Math.ceil(gridSize / 2); x++) {
    for (let y = 0; y < gridSize; y++) {
      const index = x * gridSize + y;
      const fillSquare = parseInt(hash[index], 16) % 2 === 0;

      if (fillSquare) {
        for (let i = 0; i < squareSize; i++) {
          for (let j = 0; j < squareSize; j++) {
            const pixelX1 = Math.floor(x * squareSize + i);
            const pixelY1 = Math.floor(y * squareSize + j);
            const pixelX2 = Math.floor((gridSize - x - 1) * squareSize + i);
            const pixelY2 = pixelY1;

            const offset1 = (pixelY1 * width + pixelX1) * 4;
            const offset2 = (pixelY2 * width + pixelX2) * 4;

            frameData[offset1] = patternColor.r;      // Red channel
            frameData[offset1 + 1] = patternColor.g;  // Green channel
            frameData[offset1 + 2] = patternColor.b;  // Blue channel
            frameData[offset1 + 3] = 255; // Alpha channel (fully opaque)

            frameData[offset2] = patternColor.r;
            frameData[offset2 + 1] = patternColor.g;
            frameData[offset2 + 2] = patternColor.b;
            frameData[offset2 + 3] = 255;
          }
        }
      }
    }
  }

  return { imageData: frameData, width, height };
}

// Function to save raw image data to a JPEG file
function saveToJpeg(imageData, width, height, outputPath) {
  const rawImageData = {
    data: imageData,
    width: width,
    height: height
  };

  const jpegImageData = jpeg.encode(rawImageData, 90); // Quality is set to 90
  fs.writeFileSync(outputPath, jpegImageData.data);
  console.log(`Image saved to ${outputPath}`);
}

// Function to convert image file to Base64 string
function imageToBase64(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  return imageData.toString('base64');
}

// Function to save Base64 string to a text file
function saveBase64ToFile(base64String, outputPath) {
  fs.writeFileSync(outputPath, base64String);
  console.log(`Base64 string saved to ${outputPath}`);
}

// Example usage
const username = 'freeworldflash';
const email = 'damarionj0924@aurorak12.org';

// Generate identicon as raw image data
const { imageData, width, height } = generateIdenticonData(username, email);

// Save the image data as a JPEG file
const imagePath = 'output_image3.jpeg';
saveToJpeg(imageData, width, height, imagePath);

// Convert the image to Base64
const base64String = imageToBase64(imagePath);

// Save the Base64 string to a text file
const base64Path = 'output_image3.txt';
saveBase64ToFile(base64String, base64Path);
