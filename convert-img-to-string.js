import fs from 'fs';

let img_path = "/Users/julianhammer/Downloads/0cf700de-ddea-421d-a0ca-8c2410ab494b.jpg" // Replace with the path to your image file;
let txt_path = "viki_katze.txt" // Replace with the path to save the Base64 string;

// Function to convert an image file to a Base64 string
function imageToBase64(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  return imageData.toString('base64');
}

// Function to save the Base64 string to a text file
function saveBase64ToFile(base64String, outputPath) {
  fs.writeFileSync(outputPath, base64String);
  console.log(`Base64 string saved to ${outputPath}`);
}

// Example usage
const imagePath = `${img_path}`; // Replace with your image file path
const base64Path = `${txt_path}`; // Replace with your desired output text file path

// Convert the image to a Base64 string
const base64String = imageToBase64(imagePath);

// Save the Base64 string to a text file
saveBase64ToFile(base64String, base64Path);
