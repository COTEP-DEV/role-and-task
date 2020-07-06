//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AHandler, { ProgramState } from './AHandler.js';
import RoleAndTask from '../../RoleAndTask.js';
import PromiseCommandPattern from '../../Utils/PromiseCommandPattern.js';
import ATask from '../Tasks/ATask';

/**
 * This class handle Task for the process
 * Meaning launching a Task, stop a Task
 *
 * data => [{
 *    name: String,
 *    color: String,
 *    id: string,
 *    idsAllowedRole: [Number],
 *    obj: ATask,
 * }],
 *
 * (For example with Role)
 *
 * Call -> constructor(data, mapTaskConstantAndObject);
 */
export default class TaskHandler extends AHandler<ATask> {
  /**
   * Get all active task in array
   */
  public getAllActiveTasks(): ATask[] {
    return this.getAllSomething()
      .filter(x => x.isActive());
  }

  /**
   * Get infos tasks relative to the type of tasks
   */
  public getInfosFromAllActiveTasks(): Promise<{
    idTask: string;

    [key: string]: unknown;
  }[]> {
    return PromiseCommandPattern({
      func: async () => {
        const activeTasks = this.getAllActiveTasks();

        // If there is no active tasks, no infos to retrieve
        if (!activeTasks.length) {
          return [];
        }

        const ret = await Promise.all(activeTasks.map(x => x.gatherInfosFromTask())) || [];

        return ret.map((x, xi) => ({
          ...x,

          idTask: activeTasks[xi].id,
        }));
      },
    });
  }

  /**
   * To all tasks apply the new program state
   */
  public applyNewProgramState(programState: ProgramState, oldProgramState: ProgramState): Promise<true> {
    return PromiseCommandPattern({
      func: async () => {
        const activeTasks = this.getAllActiveTasks();

        // If there is no active tasks, no infos to retrieve
        if (!activeTasks.length) {
          return [];
        }

        await Promise.all(activeTasks.map(x => x.applyNewProgramState(programState, oldProgramState)));

        return true;
      },
    });
  }

  /**
   * Start the given Task
   */
  public startTask(idTask: string, args: unknown[]): Promise<unknown> {
    return PromiseCommandPattern({
      func: async () => {
        const ret = await this.startSomething(idTask, args);

        RoleAndTask.getInstance()
          .displayMessage({
            str: `[TaskHandler] Task N°${idTask} started`.green,
          });

        return ret;
      },
    });
  }

  /**
   * Stop the given Task
   */
  public stopTask(idTask: string, args: unknown[] = []): Promise<unknown> {
    return PromiseCommandPattern({
      func: async () => {
        RoleAndTask.getInstance()
          .displayMessage({
            str: `[TaskHandler] Ask Task N°${idTask} to stop`.blue,
          });

        const ret = await this.stopSomething(idTask, args);

        RoleAndTask.getInstance()
          .displayMessage({
            str: `[TaskHandler] Task N°${idTask} stoped`.green,
          });

        return ret;
      },
    });
  }

  /**
   * Stop all the running Tasks
   */
  public stopAllTask(args?: unknown[]): Promise<unknown> {
    return PromiseCommandPattern({
      func: () => this.stopAllSomething(args),
    });
  }

  /**
   * Get a list of running Task status (active or not)
   */
  public getTaskListStatus(): {
    name: string;
    id: string;
    isActive: boolean;
  }[] {
    return this.getSomethingListStatus();
  }

  public getTask(idTask: string): Promise<ATask> {
    return PromiseCommandPattern({
      func: () => this.getSomething(idTask),
    });
  }
}
