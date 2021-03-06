//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import childProcess from 'child_process';
import Utils from './Utils.js';
import Errors from './Errors.js';
import RoleAndTask from '../RoleAndTask.js';

let instance: UtilsProcess | null = null;

/**
 * This class handle all processes that are related to PROGRAM instance
 */
export default class UtilsProcess {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;

    return instance;
  }

  public static getInstance(): UtilsProcess {
    return instance || new UtilsProcess();
  }

  protected static getZombieFromAllPid(allPids: string[], goodPids: string[]): string[] {
    return allPids.filter(x => !goodPids.includes(x));
  }

  /**
   * Evaluate PROGRAM processes and return a list of Zombies and Healthy processes that are actually running
   */
  public static async evaluateProgramProcesses(): Promise<any> {
    // Get the processes that have right to exist
    const healthy = await RoleAndTask.getInstance()
      .getFullSystemPids();

    // We first evalutate all process that exist
    const allProcess = await UtilsProcess.evaluateNumberOfProcessThatExist();

    // Extract the zombies from all pids that get detected
    const zombies = UtilsProcess.getZombieFromAllPid(allProcess, healthy);

    return {
      zombies,
      healthy,
    };
  }

  /**
   * Evaluate the number of processus that exist
   */
  public static async evaluateNumberOfProcessThatExist(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      childProcess.exec(Utils.monoline([
        // Display the processes
        'ps aux',

        // Give the result to the next command
        ' | ',

        // Use a regexp to identify the lines that correspond to PROGRAM processes only [+ tests mocha processes]
        'grep -oEi \'([0-9].+?node.+src/systemBoot.+)|([0-9].+?node.+node_modules.+?mocha.+)\'',

        //
        // WARNING problem here, ps aux return the processes created by the command itself
        // so we need to exclude it later using another regexp
        //
        // WARNING problem here, ps return the processes created by npm
        // so we need to exclude it later using another regexp
        //
      ]), (error, stdout, stderr) => {
        // Error of childProcess
        if (error) {
          return reject(new Errors('E8083', `${String(error)}`));
        }

        // Error of the console command
        if (stderr) {
          return reject(new Errors('E8083', `${String(stderr)}`));
        }

        // Pass a second regexp to remove the pid of the commands themselves moreover npm scripts
        const regexp = /^((?!grep|npm).)+$/img;

        const filtered: string[] = stdout.match(regexp) || [];

        // Now we extract pid from filtered data
        const pids = filtered.map(x => String(x.split(' ')[0]));

        // Exclude processes about the command itself
        return resolve(pids);
      });
    });
  }

  public static killOneProcess(pid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      childProcess.exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
        // Error of childProcess
        if (error) {
          return reject(new Errors('E8083', `${String(error)}`));
        }

        // Error of the console command
        if (stderr) {
          return reject(new Errors('E8083', `${String(stderr)}`));
        }

        return resolve(pid);
      });
    });
  }
}
