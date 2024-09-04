import fs from 'fs';

let txt_path = "my_image.txt_path" // Replace with the path to your Base64 string file;
let img_path = "my_image.jpeg_path" // Replace with the path to save the image file;

// Function to convert a Base64 string back to an image
function base64ToImage(base64String, outputPath) {
  // Convert the Base64 string to binary data
  const imageBuffer = Buffer.from(base64String, 'base64');

  // Write the binary data to a file
  fs.writeFileSync(outputPath, imageBuffer);
  console.log(`Image saved to ${outputPath}`);
}

// Function to read the Base64 string from a text file
function readBase64FromFile(inputPath) {
  return fs.readFileSync(inputPath, 'utf8');
}

// Example usage
const base64Path = `${txt_path}`; // Replace with your Base64 string file path
const imagePath = `${img_path}`; // Replace with your desired output image file path

// Read the Base64 string from the text file
const base64String = readBase64FromFile(base64Path);

// Convert the Base64 string to an image
base64ToImage(base64String, imagePath);
