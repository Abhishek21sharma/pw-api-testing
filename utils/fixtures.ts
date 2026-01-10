import { test as base, Fixtures } from "@playwright/test";
//now we have imported 'test' method and renamed it to 'base'
import { RequestHandler } from "./request-handler";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custome-expect";

import { config } from "../api-test.config";
import { createTokenWithoutAnyDependency } from "../helpers/createToken";

//here we are defining the type of 'api' so it's of type 'RequestHandler'
//so that in the calling method it can be used and when type . , it should list all properties
//name can be anything , like CustomFixtures or like TestOptions..
export type CustomFixtures = {
  api: RequestHandler;
  config: typeof config; //look how we define it , when it's just a variable and not the class
};

//worker fixtures have their own type and not like regular fixtures..
export type WorkerFixtures = {
  authToken: string;
};

//base.extend method accept object..
export const test = base.extend<CustomFixtures, WorkerFixtures>({
  //worker scope fixture..
  authToken: [
    async ({}, use) => {
      const authToken = await createTokenWithoutAnyDependency();
      await use(authToken);
    },
    { scope: "worker" },
  ],

  //{} --> async function accepts 2 params:
  // object with some dependies (data, object etc)
  //and second one is 'use' (it's used for wrap test execution)
  api: async ({ request }, use) => {
    //since config is directly imported as here, so it's aviable to be used here
    // const baseURL = "https://conduit-api.bondaracademy.com/api";
    const logger = new APILogger();
    //below is to add custome expect conditions and logger messages
    setCustomExpectLogger(logger);
    //const requestHandler = new RequestHandler(request, baseURL, logger);
    const requestHandler = new RequestHandler(request, config.apiUrl, logger);
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
    //now this is used to be go a fixture..
  },
});

//worker scoped fixtures:: this is going to use as default token(no need to add again) for this worker..
