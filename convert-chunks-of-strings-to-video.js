import fs from 'fs';
import path from 'path';

let folder_name = "my_video_chunks"; // Replace with the folder containing your .txt chunks
let file_suffix = "mp4"; // Replace with your desired output video file suffix

// Function to read all Base64 chunks from .txt files in the specified folder
function readChunksFromFiles(inputFolder) {
  const files = fs.readdirSync(inputFolder).filter(file => file.endsWith('.txt'));
  
  // Sort files by their chunk index if they follow a naming pattern like 'chunk_1.txt', 'chunk_2.txt', etc.
  files.sort((a, b) => {
    const aIndex = parseInt(a.match(/(\d+)\.txt$/)[1]);
    const bIndex = parseInt(b.match(/(\d+)\.txt$/)[1]);
    return aIndex - bIndex;
  });
  
  // Read and concatenate all chunks
  let base64String = '';
  for (const file of files) {
    const chunk = fs.readFileSync(path.join(inputFolder, file), 'utf8');
    base64String += chunk;
  }
  
  return base64String;
}

// Function to convert Base64 string back to video and save it as a file
function base64ToVideo(base64String, outputPath) {
  const videoBuffer = Buffer.from(base64String, 'base64');
  fs.writeFileSync(outputPath, videoBuffer);
  console.log(`Video saved to ${outputPath}`);
}

// Main function to reconstruct the video from chunks
function reconstructVideo(inputFolder, outputVideoPath) {
  // Read all chunks and concatenate them
  const base64String = readChunksFromFiles(inputFolder);
  
  // Convert the concatenated Base64 string back to a video file
  base64ToVideo(base64String, outputVideoPath);
}

// Example usage
const inputFolder = `./${folder_name}`; // Replace with the folder containing your .txt chunks
const outputVideoPath = `${folder_name}.${file_suffix}`; // Replace with your desired output video file path

// Reconstruct the video from the chunks
reconstructVideo(inputFolder, outputVideoPath);
