const fs = require("fs");
const glob = require("glob");
const { resolve } = require("path");

console.time("Took");
const keepChunks = ["IHDR", "PLTE", "tRNS", "IDAT", "IEND"];
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const memBlockSiz = 1024 * 1024;
const memBlockRead = 0;
const memBlockWrite = memBlockSiz;
const globalMemory = Buffer.allocUnsafe(memBlockSiz * 2);
const globalDataView = new DataView(globalMemory.buffer);
const globalTextDecoder = new TextDecoder;
let globalBytesRead = 0;
let globalBytesWritten = 0;
let globalFilesRewritten = 0;
class PNG {
  readSignature() {
    const signature = globalMemory.slice(this.readOffset, pngSignature.length);
    if (!signature.equals(pngSignature)) {
      throw new Error(`Bad PNG. The signature is\n\t${JSON.stringify(signature)}\nbut expected\n\t${JSON.stringify(pngSignature)}`);
    }
    globalMemory.copyWithin(this.writeOffset, this.readOffset, this.readOffset + pngSignature.length);
    this.writeOffset += pngSignature.length;
    this.readOffset += pngSignature.length;
  }

  readBytes(n) {
    const result = globalDataView[`getUint${n * 8}`](this.readOffset);
    this.readOffset += n;
    return result;
  }

  readText(length) {
    const result = globalTextDecoder.decode(globalMemory.slice(this.readOffset, this.readOffset + length));
    this.readOffset += length;
    return result;
  }

  readChunk() {
    const chunkOffset = this.readOffset;
    const chunkDataLength = this.readBytes(4);
    const chunkType = this.readText(4);
    const chunkDataOffset = this.readOffset;
    if (chunkType === "IHDR") {
      this.width = this.readBytes(4);
      this.height = this.readBytes(4);
      this.bitDepth = this.readBytes(1);
      this.colorType = this.readBytes(1);
    }
    this.readOffset = chunkDataOffset + chunkDataLength;
    this.readOffset += 4; // CRC
    const totalChunkLength = this.readOffset - chunkOffset;
    if (keepChunks.includes(chunkType)) {
      globalMemory.copyWithin(this.writeOffset, chunkOffset, chunkOffset + totalChunkLength);
      this.writeOffset += totalChunkLength;
    }
    else {
      this.discardChunkList.push([chunkType, totalChunkLength]);
    }
  }

  fix(filename) {
    this.discardChunkList = [];
    this.readOffset = memBlockRead;
    this.writeOffset = memBlockWrite;
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size;
    let fileHandle = fs.openSync(filename);
    fs.readSync(fileHandle, globalMemory, this.readOffset, fileSizeInBytes);
    fs.closeSync(fileHandle);
    this.readSignature();
    while (this.readOffset < fileSizeInBytes) {
      this.readChunk();
    }
    const writeSizeInBytes = this.writeOffset - memBlockWrite;
    globalBytesRead += this.readOffset - memBlockRead;
    globalBytesWritten += writeSizeInBytes;
    if (writeSizeInBytes !== fileSizeInBytes) {
      console.log(filename);
      globalFilesRewritten++;
      console.log(`  discarded`, this.discardChunkList.length, "chunks", this.discardChunkList.map((chunk) => chunk[0]).join(" "), "-", this.discardChunkList.map((chunk) => chunk[1]).reduce((prev, curr) => prev + curr, 0), "bytes");
      fileHandle = fs.openSync(filename, "w");
      fs.writeSync(fileHandle, globalMemory, memBlockWrite, writeSizeInBytes);
      fs.closeSync(fileHandle);
    }
  }
}
const png = new PNG;
glob(`${resolve()}/images/**/*.png`, {}, (error, files) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  else {
    files.forEach((filename) => png.fix(filename));
    const columns = 25;
    console.log("total bytes read".padStart(columns), globalBytesRead);
    if (globalBytesRead !== globalBytesWritten) {
      console.log("files rewritten".padStart(columns), globalFilesRewritten, "/", files.length, `%${(globalFilesRewritten / files.length * 100).toFixed(2)}`);
      const percentOfOriginal = globalBytesWritten / globalBytesRead * 100;
      console.log("total bytes written".padStart(columns), globalBytesWritten, `%${percentOfOriginal.toFixed(2)}`, "of original size");
      console.log("total bytes discarded".padStart(columns), globalBytesRead - globalBytesWritten, `%${(100 - percentOfOriginal).toFixed(2)} smaller`);
    }
    else {
      console.log("all assets ok".padStart(columns), files.length);
    }
    console.timeEnd("Took");
  }
});