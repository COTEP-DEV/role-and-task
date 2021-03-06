//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// import
import Errors from './Errors.js';
import Utils from './Utils.js';
import CONSTANT from './CONSTANT/CONSTANT.js';

/**
 * Define a pattern that can be used to handle function execution errors easily
 */
class PromiseCommandPattern {
  protected funcToExecute: Function;

  protected callerFunctionName: string;

  protected error: Function | false;

  protected stackTrace = false;

  /**
   *
   * {{
   *   // Function to execute
   *   func: Function,
   *
   *   // Function to call to handle the error
   *   error: Function,
   * }}
   *
   */
  constructor({
    func,
    error,
  }: {
    func: Function;
    error?: Function;
  }) {
    // If we have the old system (with asyn execute new code)
    this.funcToExecute = func;

    this.callerFunctionName = Utils.getFunctionName(CONSTANT.NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN);

    this.error = error || false;
  }

  /**
   * Execute the fuinction to execute which is the purpose of PromiseCommandPattern
   */
  async executeFunctionToExecute() {
    try {
      // Classes the user asked for
      // Functions the users wants to access @example Spread a news
      return this.funcToExecute.call(null);
    } catch (err) {
      const error = !Errors.staticIsAnError(err) ?
        new Errors('EUNEXPECTED', String((err && err.stack) || err), this.callerFunctionName) :
        err;

      // If the user have a special error use, use it
      if (this.error) {
        await this.error(error);
      } else {
        throw error;
      }

      return false;
    }
  }

  /**
   * Execute the command using async syntax
   */
  async executeAsync() {
    try {
      // Execute the function to execute (purpose of PromiseCommandPattern)
      return this.executeFunctionToExecute();
    } catch (err) {
      // PARTICULAR CASE TO HANDLE QUIT
      // PARTICULAR CASE TO HANDLE QUIT
      if (err === CONSTANT.QUIT) {
        return err;
      }
      // PARTICULAR CASE TO HANDLE QUIT
      // PARTICULAR CASE TO HANDLE QUIT

      const error = !Errors.staticIsAnError(err) ?
        new Errors('EUNEXPECTED', String((err && err.stack) || err), this.callerFunctionName) :
        err;

      if (this.stackTrace) {
        throw Errors.shortcutStackTraceSpecial(error, this.callerFunctionName);
      }

      throw error;
    }
  }
}

/**
 * Wrapper used because we cannot call executeAsync into the constructor of PromiseCommandPattern directly, and we want a simple and quick use of it
 */
function PromiseCommandPatternFunc({
  func,
  error,
}: {
  func: Function;
  error?: Function;
}): Promise<any> {
  const promiseObj = new PromiseCommandPattern({
    func,
    error,
  });

  return promiseObj.executeAsync();
}

export default PromiseCommandPatternFunc;

