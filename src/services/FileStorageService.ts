const filePickerOptions = {
  multiple: false,
  types: [
    {
      description: 'ArchDocs',
      accept: {
        'application/json': ['.archdoc']
      }
    }
  ],
  excludeAcceptAllOption: true
};

export class FileStorageService {
  private file!: File | undefined;
  private fileHandle!: FileSystemFileHandle | undefined;

  get isFileLoaded() {
    return (
      typeof this.file !== 'undefined' && typeof this.fileHandle !== 'undefined'
    );
  }

  async openFile(): Promise<string> {
    [this.fileHandle] = await window.showOpenFilePicker(filePickerOptions);
    this.file = await this.fileHandle.getFile();
    return await this.file.text();
  }

  async saveFile(data: string): Promise<boolean> {
    try {
      if (!this.isFileLoaded) {
        this.fileHandle = await window.showSaveFilePicker(filePickerOptions);
        this.file = await this.fileHandle.getFile();
      }
      const writableStream = await this.fileHandle?.createWritable();
      await writableStream?.write(data);
      this.file = await this.fileHandle?.getFile();
      await writableStream?.close();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  serialise<T>(obj: T): string {
    return JSON.stringify(obj);
  }

  deserialise<T>(str: string): T {
    return JSON.parse(str) as T;
  }

  clearFile() {
    this.file = undefined;
    this.fileHandle = undefined;
  }
}
