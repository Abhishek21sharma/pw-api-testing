//here process.env.VARIABLENAME : here VARIABLENAME is whatever we pass with command line arguments and
//it will be assigned to it..
//so let's say TEST_ENV = ST
//so processENV = ST (as per the blow logic)
//it's similar to java: Syste,.getPRoperties()

//how to use it with command line:
//TEST_ENV=QA npx playwright test smoke.spec.ts

//on windows OS, set TEST_ENV=QA && npx playwright test smoke.spec.ts
const processENV = process.env.TEST_ENV;
//adding a default to it , if the TEST_ENV is not provided..
const env = processENV || "dev";
//so it means , env is either processENV is value is provided or 'dev' if it's not..
console.log(`Test ENV: ${env}`);

const config = {
  apiUrl: "https://conduit-api.bondaracademy.com/api",
  userEmail: "Abhi21sharma@test.com",
  userPassword: "abhi@test",
};

//that's how we export it if we don't have it as a class..
export { config };

//approach 1
//to use it , since it's a object (json), we can directly import it and start to use as object.array.key..
//similar to how we read jsons..

//approch 2
//playwright recommends this to be used as 'fixture', instead of direct
//import it as fixture has more benifits

//look at custom fixture how we are handling this..

//How to switch between ENVs to run our tests.
if (env === "ST") {
  //then we can have different credentials etc..

  //re-assign the value to this object..
  //should this object be then const pr let ? ,  like let config or const config ??
  config.userEmail = "newEmail";
  config.userPassword = "";
}

if (env === "QA") {
  //then we can have different credentials etc..

  //re-assign the value to this object..
  //should this object be then const pr let ? ,  like let config or const config ??
  config.userEmail = "newEmail";
  config.userPassword = "";
}
