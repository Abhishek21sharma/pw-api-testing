import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";
import { config } from "../api-test.config";
//in order to use 'request' here (in createTokenWithoutAnyDependency method), let's create a context()..
import { request, Request } from "@playwright/test";

//2 ways to create independent functions in playwright..
//here we can create functions which will be used later in the other files..

export async function createToken(
  api: RequestHandler,
  email: string,
  password: string
) {
  const tokenResponse = await api
    .path("/users/login")
    .body({ user: { email: email, password: password } })
    .postRequest(200);
  return "Token " + tokenResponse.user.token;
}

//total independent function -- not recommended >??
export async function createTokenWithoutAnyDependency() {
  const logger = new APILogger();
  const context = await request.newContext();
  const api = new RequestHandler(context, config.apiUrl, logger);

  //error handling::
  try {
    const tokenResponse = await api
      .path("/users/login")
      .body({
        user: { email: config.userEmail, password: config.userPassword },
      })
      .postRequest(200);
    return "Token " + tokenResponse.user.token;
  } catch (error: any) {
    Error.captureStackTrace(error, createTokenWithoutAnyDependency);
    throw error;
  } finally {
    //we don't want to keep them open in the memory
    await context.dispose();
  }
}
