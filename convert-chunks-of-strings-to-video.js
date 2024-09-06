import fs from 'fs';
import path from 'path';

// Function to read all Base64 chunks from JSON files in the specified folder and write them directly to a file
function reconstructVideo(inputFolder, outputVideoPath) {
  const files = fs.readdirSync(inputFolder).filter(file => file.endsWith('.json'));

  // Sort files by their chunk index if they follow a naming pattern like 'chunk_1.json', 'chunk_2.json', etc.
  files.sort((a, b) => {
    const aIndex = parseInt(a.match(/(\d+)\.json$/)[1]);
    const bIndex = parseInt(b.match(/(\d+)\.json$/)[1]);
    return aIndex - bIndex;
  });

  // Create a writable stream for the output video file
  const writeStream = fs.createWriteStream(outputVideoPath);

  let totalSize = 0;
  let processedSize = 0;
  
  // Get the total size of all chunks
  files.forEach(file => {
    const chunkData = JSON.parse(fs.readFileSync(path.join(inputFolder, file), 'utf8'));
    totalSize += Buffer.byteLength(chunkData.base64Data, 'base64');
  });

  // Read each chunk and write it to the output video file
  files.forEach(file => {
    const chunkData = JSON.parse(fs.readFileSync(path.join(inputFolder, file), 'utf8'));
    const chunkBuffer = Buffer.from(chunkData.base64Data, 'base64');

    // Write the chunk buffer to the output file
    writeStream.write(chunkBuffer);

    // Update the processed size and display progress
    processedSize += chunkBuffer.length;
    displayProgress(processedSize, totalSize);
  });

  // End the writable stream
  writeStream.end(() => {
    console.log(); // New line after progress is complete
    console.log(`Video saved to ${outputVideoPath}`);
  });
}

// Function to display the progress percentage
function displayProgress(processedSize, totalSize) {
  const percentage = ((processedSize / totalSize) * 100).toFixed(2);
  process.stdout.write(`Progress: ${percentage}%\r`); // Output progress on the same line
}

// Example usage
const folder_name = 'IMG_0050_chunks'; // Replace with the folder containing your .json chunks
const file_suffix = 'MOV'; // Replace with your desired output video file suffix
const inputFolder = `./${folder_name}`; // Replace with the folder containing your .json chunks
const outputVideoPath = `${folder_name}.${file_suffix}`; // Replace with your desired output video file path

// Reconstruct the video from the chunks
reconstructVideo(inputFolder, outputVideoPath);
