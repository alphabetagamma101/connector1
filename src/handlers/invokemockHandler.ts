// src/handlers/invokemockHandler.ts
import * as fs from 'fs';
import * as path from 'path';

let currentMockFileIndex = 0;

const mockFiles = [
  path.join(__dirname, '../secret/mocks/mock1.txt'),
  path.join(__dirname, '../secret/mocks/mock2.txt'),
  path.join(__dirname, '../secret/mocks/mock3.txt')
];

export async function performInvokemock(content: string): Promise<string> {
  const mockFilePath = mockFiles[currentMockFileIndex];

  if (!fs.existsSync(mockFilePath)) {
    throw new Error(`Mock file not found: ${mockFilePath}`);
  }

  const fileContent = fs.readFileSync(mockFilePath, 'utf-8');
  return fileContent;
}

export function setMockFileIndex(index: number): void {
  if (index >= 0 && index < mockFiles.length) {
    currentMockFileIndex = index;
  } else {
    throw new Error(`Invalid mock file index: ${index}. Valid range: 0-${mockFiles.length - 1}`);
  }
}

export function getMockFiles(): string[] {
  return [...mockFiles];
}

export function getCurrentMockFileIndex(): number {
  return currentMockFileIndex;
}