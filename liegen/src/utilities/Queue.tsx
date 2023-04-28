class Queue {
  executingQueueTask: boolean;
  queue: Array<() => Promise<void>>;

  constructor() {
    this.queue = [];
    this.executingQueueTask = false;
    this.runQueue();
  }

  async runQueue() {
    if (!this.executingQueueTask) {
      this.executeQueueTask();
    }
    setTimeout(() => this.runQueue(), 50);
  }

  async executeQueueTask() {
    const task = this.queue.shift();
    if (!task) {
      return;
    }
    this.executingQueueTask = true;
    let functionToExecute = task;
    while (true) {
      if (typeof functionToExecute !== 'function') {
        break;
      }
      await functionToExecute();
      // functionToExecute = await functionToExecute();
    }
    this.executingQueueTask = false;
  }

  pushQueueTask(task: () => Promise<void>) {
    this.queue.push(task);
  }
}

const queue = new Queue();

export default queue;