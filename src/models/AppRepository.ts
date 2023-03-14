import { Pinia } from 'pinia';
import { Database, Repository } from 'pinia-orm';
import { FileStorageService } from 'src/services/FileStorageService';
import Input from './Input';
import Output from './Output';
import Process from './Process';
import ProcessStep from './ProcessStep';

export default class AppRepository extends Repository {
  constructor(database: Database, pinia?: Pinia) {
    super(database, pinia);
    this.fileStorage = new FileStorageService();
  }

  private fileStorage: FileStorageService;

  getGlobalState() {
    return {
      processes: this.repo(Process).all(),
      processSteps: this.repo(ProcessStep).all(),
      inputs: this.repo(Input).all(),
      outputs: this.repo(Output).all()
    };
  }

  clear(): void {
    this.repo(Process).flush();
    this.repo(ProcessStep).flush();
    this.repo(Input).flush();
    this.repo(Output).flush();
    this.fileStorage.clearFile();
  }

  async saveToFile(): Promise<boolean> {
    const state = this.fileStorage.serialise(this.getGlobalState());
    return await this.fileStorage.saveFile(state);
  }

  async openFromFile(): Promise<void> {
    try {
      const stateText = await this.fileStorage.openFile();
      const state = this.fileStorage.deserialise<{
        processes: Process[];
        processSteps: ProcessStep[];
        inputs: Input[];
        outputs: Output[];
      }>(stateText);

      this.repo(Process).fresh(state.processes);
      this.repo(ProcessStep).fresh(state.processSteps);
      this.repo(Input).fresh(state.inputs);
      this.repo(Output).fresh(state.outputs);
    } catch (error) {
      console.log(error);
    }
  }
}
