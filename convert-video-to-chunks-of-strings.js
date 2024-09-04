import fs from "fs";
import path from "path";

let file_name = "my_video"; // Replace with your video file name
let file_suffix = "mp4"; // Replace with your video file suffix

// Function to split a Base64 string into chunks
function splitBase64IntoChunks(base64String, chunkSize) {
  const numChunks = Math.ceil(base64String.length / chunkSize);
  const chunks = [];

  for (let i = 0; i < numChunks; i++) {
    chunks.push(base64String.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  return chunks;
}

// Function to save each chunk as a .txt file in the specified folder
function saveChunksToFiles(chunks, outputFolder) {
  // Ensure the output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  chunks.forEach((chunk, index) => {
    const outputPath = path.join(outputFolder, `chunk_${index + 1}.txt`);
    fs.writeFileSync(outputPath, chunk);
    console.log(`Chunk ${index + 1} saved to ${outputPath}`);
  });
}

// Main function to process the video
function processVideo(videoPath, outputFolder, maxChunkSizeMB = 10) {
  // Read the video file
  const videoData = fs.readFileSync(videoPath);

  // Convert the video to a Base64 string
  const base64String = videoData.toString("base64");

  // Calculate the maximum chunk size in characters (1 byte = 4/3 Base64 characters)
  const maxChunkSize = maxChunkSizeMB * 1000000;

  // Split the Base64 string into chunks
  const chunks = splitBase64IntoChunks(base64String, maxChunkSize);

  // Save each chunk to a .txt file
  saveChunksToFiles(chunks, outputFolder);
}

// Example usage
const videoPath = `./${file_name}.${file_suffix}`; // Replace with your video file path
const outputFolder = `./${file_name}`; // Replace with your desired output folder

// Process the video and save the chunks
processVideo(videoPath, outputFolder);
