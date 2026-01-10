//read readME..
//download dotenv from npm install dotenv --save-dev
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
//above imports are from laywright.config.ts file.. it tells how to use .env file..

const processENV = process.env.TEST_ENV;
const env = processENV || "prod";
console.log(`Test ENV: ${env}`);

const config = {
  apiUrl: "https://conduit-api.bondaracademy.com/api",
  userEmail: "Abhi21sharma@test.com",
  userPassword: "abhi@test",
};

if (env === "ST") {
  config.userEmail = "newEmail";
  config.userPassword = "";
}

if (env === "prod") {
  //now we have this complie time issue.. since TS doesn't know the type here.. as the type is undefined
  //config.userEmail = process.env.PROD_USERNAME
  //2 solution
  //1config.userEmail = process.env.PROD_USERNAME as string;
  //2 add a absolute condition when to call this code only when some data isprovide
  // sep 2 is the best way to deal with this

  //also look here || here in 'if' blocks works as OR
  //but same way we deined outside of if block inrequest-handle.ts , form URL, it works as diff..

  /*
  .
  .  if (!this.clearAuthFlag) {
      // here || is otherwise, like else condition, looks like it's not JAva || or condition ..
      this.apiHeaders["Authorization"] =
        this.apiHeaders["Authorization"] || this.defaultAuthToken;
    }
  */

  //step 2 is the more organised way
  if (!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
    throw Error(`Missing required ENV variables..`);
  }
  config.userEmail = process.env.PROD_USERNAME;
  config.userPassword = process.env.PROD_PASSWORD;

  //this wont work here.. since it's an object key and not a direct variable..
  //config.apiUrl : string | undefined = process.env.PROD_URL
  //config.apiUrl : typeof string = process.env.prod_url : string ;
  //config.apiUrl  = process.env.PROD_URL  : string | undefined//but PROD_URL is dumy name here for ref;
}

export { config };
