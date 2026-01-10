import { expect as baseExpect } from "@playwright/test";
import { APILogger } from "./logger";
//this is to add more custome messages and errors in expects..

let apiLogger: APILogger;

//this is an arrow function
//since it's not  a class, we have to write a function(arrow function) like this here
export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger;
};
//this will be used in fixture

//in order for matchers to find this method (shouldEqual)
//we need to declare it in global playwright namespace

//this is to make typescrupt happy..
declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      shouldEqual(expected: T): R;
    }
  }
}

export const expect = baseExpect.extend({
  //new custom expect condition name
  //let's say name of the new conditionis shouldEqual

  //custom arguments with custome type (two arguments ..)
  shouldEqual(received: any, expected: any) {
    let pass: boolean;
    let logs: string = "";
    try {
      baseExpect(received).toEqual(expected);
      pass = true;
    } catch (e: any) {
      pass = false;
      apiLogger.getRecentLogs();
    }

    const hint = this.isNot ? "not" : "";
    const message =
      this.utils.matcherHint("shouldEqual", undefined, undefined, {
        isNot: this.isNot,
      }) +
      "\n\n" +
      `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)} \n\n` +
      `Recent Api Activity: \n${logs}`;

    return {
      message: () => message,
      pass,
    };
  },
});
