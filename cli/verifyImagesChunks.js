const fs = require("fs");
const glob = require("glob");
const { resolve } = require("path");

const errorList = [];
const keepChunks = ["IHDR", "PLTE", "tRNS", "IDAT", "IEND"];
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const memBlockSiz = 1024 * 1024;
const memBlockRead = 0;
const memBlockWrite = memBlockSiz;
const globalMemory = Buffer.allocUnsafe(memBlockSiz * 2);
const globalDataView = new DataView(globalMemory.buffer);
const globalTextDecoder = new TextDecoder;
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

  check(filename) {
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
    if (writeSizeInBytes !== fileSizeInBytes) {
      errorList.push(`${filename} contains unnecessary chunks.`);
    }
  }
}
const png = new PNG;
glob(`${resolve()}/images/**/*.png`, {}, (error, files) => {
  if (error) {
    console.error(error);
  }
  else {
    files.forEach((filename) => png.check(filename));
    if (errorList.length === 0) {
      console.log("Images chunks verification succeeded.");
    }
    else {
      console.error("Images chunks verification failed (\"pigeon fixPNG\" can most likely resolve this).");
      for (const error of errorList) {
        console.error(error);
      }
      process.exit(1);
    }
  }
});