import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Function to split a chunk of the video file into Base64 and store it in JSON files
async function processAndSaveChunks(
  readStream,
  totalSize,
  outputFolder,
  videoName,
  maxChunkSize
) {
  let chunkBuffer = Buffer.alloc(0);
  let chunkIndex = 1;
  let processedSize = 0;
  let writePromises = [];

  readStream.on("data", async (chunk) => {
    // Append new chunk to the buffer
    chunkBuffer = Buffer.concat([chunkBuffer, chunk]);

    // When the buffer exceeds the max chunk size, process and save
    while (chunkBuffer.length >= maxChunkSize) {
      const currentChunk = chunkBuffer.slice(0, maxChunkSize);
      chunkBuffer = chunkBuffer.slice(maxChunkSize);

      // Save chunk asynchronously and push to the promises array
      const promise = saveChunkToFile(currentChunk.toString("base64"), outputFolder, videoName, chunkIndex);
      writePromises.push(promise);

      chunkIndex++;

      // Update the amount of processed data
      processedSize += maxChunkSize;
      displayProgress(processedSize, totalSize);
    }
  });

  readStream.on("end", async () => {
    // Process any leftover data in the buffer
    if (chunkBuffer.length > 0) {
      const promise = saveChunkToFile(chunkBuffer.toString("base64"), outputFolder, videoName, chunkIndex);
      writePromises.push(promise);
      processedSize += chunkBuffer.length;
      displayProgress(processedSize, totalSize);
    }

    // Wait for all the write operations to finish
    await Promise.all(writePromises);

    console.log(`All chunks saved.`);
  });

  readStream.on("error", (err) => {
    console.error("Error reading the video file: ", err);
  });
}

// Function to save each chunk as a JSON file in the specified folder (async)
async function saveChunkToFile(base64Chunk, outputFolder, videoName, chunkIndex) {
  const chunkData = {
    videoName: videoName, // Unique name for the video
    chunkNumber: chunkIndex, // Ordering number for the chunk
    base64Data: base64Chunk, // Base64 chunk data
  };

  const outputPath = path.join(outputFolder, `chunk_${chunkIndex}.json`);

  // Save the chunk as a JSON file asynchronously
  return fs.promises.writeFile(outputPath, JSON.stringify(chunkData, null, 2));
}

// Function to display the progress percentage
function displayProgress(processedSize, totalSize) {
  const percentage = ((processedSize / totalSize) * 100).toFixed(2);
  process.stdout.write(`Progress: ${percentage}%\r`); // Output progress on the same line
}

// Main function to process the video
async function processVideo(videoPath, outputFolder, maxChunkSizeMB = 7.5) {
  // Generate a unique UUID for the video
  const videoName = uuidv4();

  // Ensure the output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  // Get the total size of the video file
  const { size: totalSize } = fs.statSync(videoPath);

  // Calculate the maximum chunk size in bytes (1MB = 1,000,000 bytes)
  const maxChunkSize = Math.floor(maxChunkSizeMB * 1000000);

  // Create a readable stream for the video file
  const readStream = fs.createReadStream(videoPath);

  // Process the video file in chunks and save them
  await processAndSaveChunks(readStream, totalSize, outputFolder, videoName, maxChunkSize);
}

// Example usage
const file_name = "IMG_0050"; // Replace with your video file name
const file_suffix = "MOV"; // Replace with your video file suffix
const videoPath = `./${file_name}.${file_suffix}`; // Replace with your video file path
const outputFolder = `./${file_name}_chunks`; // Replace with your desired output folder

// Process the video and save the chunks
processVideo(videoPath, outputFolder);
