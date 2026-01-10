//import { test, expect } from "@playwright/test";
import { expect } from "@playwright/test";
import { test } from "../utils/fixtures";
//now use the 'test' from custom fixtures..
import { RequestHandler } from "../utils/request-handler";
import { APILogger } from "../utils/logger";
import { createToken } from "../helpers/createToken";

let authToken: string; //this is how we will share the object to all 'test' methods ..
test.beforeAll("Get Token", async ({ api, config }) => {
  // const tokenResponse = await api
  //   .path("/users/login")
  //   .body({ user: { email: config.userEmail, password: config.userPassword } })

  //   //.body({ user: { email: "Abhi21sharma@test.com", password: "abhi@test" } })
  //   .postRequest(200);
  // authToken = "Token " + tokenResponse.user.token;

  //use the helper method here instead of code liek above
  authToken = await createToken(api, config.userEmail, config.userPassword);
});

test("Get Articles", async ({ api }) => {
  // -- https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0

  // const response = await api
  //   .path("/articles")
  //   .param({ limit: 10, offset: 0 })
  //   .getRequest(200);

  const response = await api
    .path("/articles")
    .param({ limit: 10, offset: 0 })
    .getRequest(200);
  //.getRequest(201); // this is to see the log messages

  console.log(response);

  // api
  //   .url("https://conduit-api.bondaracademy.com/api")
  //   .path("/articles")
  //   .param({ limit: 10, offset: 0 });
  // .getUrl(); --> made it private to call it internally from post/get methods.. (framework design)
  //api.body({ name: "Abhi" });
  // const api = new RequestHandler(); //let's create this in fixture..
  //api.body({}).url('').header({}) -->> this is how a fluent design pattern works..
});

//need to delete this article using code or using UI , otherwise it can't have same title again and agian
test("Create and Delete article", async ({ api }) => {
  const createArticleResponse = await api
    .path("/articles")
    .header({ Authorization: authToken })
    .body({
      article: {
        title: "Test Two Test",
        description: "Test description",
        body: "Test body",
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponse.article.title).toEqual("Test Two Test");

  const slugId = createArticleResponse.article.slug;

  console.log("slug id: " + slugId);
});

//dummy test to test our logger..
test("logger", () => {
  const logger = new APILogger();
  logger.logRequest(
    "POST",
    "https://test.com/",
    { Authorization: "Token " + authToken },
    { foo: "bar" }
  );

  logger.logResponse(200, { foo: "bar" });

  const logs = logger.getRecentLogs();
  console.log(logs);
});
