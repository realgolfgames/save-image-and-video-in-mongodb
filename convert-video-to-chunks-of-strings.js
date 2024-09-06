import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Function to process video and save chunks as JSON files
async function processAndSaveChunks(readStream, totalSize, outputFolder, videoName, maxChunkSize) {
  let chunkIndex = 1;
  let processedSize = 0;
  let chunkBuffer = Buffer.alloc(0);

  const saveChunkToFile = async (buffer, index) => {
    const base64Chunk = buffer.toString("base64");
    const chunkData = {
      videoName: videoName,
      chunkNumber: index,
      base64Data: base64Chunk,
    };

    const outputPath = path.join(outputFolder, `chunk_${index}.json`);
    await fs.promises.writeFile(outputPath, JSON.stringify(chunkData, null, 2));
    displayProgress(processedSize, totalSize);
  };

  readStream.on("data", (chunk) => {
    chunkBuffer = Buffer.concat([chunkBuffer, chunk]);

    while (chunkBuffer.length >= maxChunkSize) {
      const currentChunk = chunkBuffer.slice(0, maxChunkSize);
      chunkBuffer = chunkBuffer.slice(maxChunkSize);

      saveChunkToFile(currentChunk, chunkIndex);
      chunkIndex++;
      processedSize += maxChunkSize;
    }
  });

  readStream.on("end", async () => {
    if (chunkBuffer.length > 0) {
      await saveChunkToFile(chunkBuffer, chunkIndex);
      processedSize += chunkBuffer.length;
      displayProgress(processedSize, totalSize);
    }
    console.log(`All chunks saved.`);
  });

  readStream.on("error", (err) => {
    console.error("Error reading the video file: ", err);
  });
}

// Function to display the progress percentage
function displayProgress(processedSize, totalSize) {
  const percentage = ((processedSize / totalSize) * 100).toFixed(2);
  process.stdout.write(`Progress: ${percentage}%\r`);
}

// Main function to process the video
async function processVideo(videoPath, outputFolder, maxChunkSizeMB = 7.5) {
  const videoName = uuidv4();

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const { size: totalSize } = fs.statSync(videoPath);
  const maxChunkSize = maxChunkSizeMB * 1000000; // 10MB in bytes

  const readStream = fs.createReadStream(videoPath);

  await processAndSaveChunks(readStream, totalSize, outputFolder, videoName, maxChunkSize);
}

// Example usage
const file_name = "IMG_0050"; // Replace with your video file name
const file_suffix = "MOV"; // Replace with your video file suffix
const videoPath = `./${file_name}.${file_suffix}`; // Replace with your video file path
const outputFolder = `./${file_name}_chunks`; // Replace with your desired output folder

processVideo(videoPath, outputFolder);
