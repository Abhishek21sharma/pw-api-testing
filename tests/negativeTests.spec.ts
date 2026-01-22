import { test } from "../utils/fixtures";
import { expect } from "../utils/custome-expect";

//creating all use case data set here...
//it's object but in-side array
[
  {
    username: "dd",
    usernameErrorMessage: "is too short (minimum is 3 characters)",
  },
  { username: "ddd", usernameErrorMessage: "" },
  { username: "dddddddddddddddddddd", usernameErrorMessage: "" },
  {
    username: "ddddddddddddddddddddd",
    usernameErrorMessage: "is too long (maximum is 20 characters)",
  },
].forEach(({ username, usernameErrorMessage }) => {
  test(`Error msg validation for ${username}`, async ({ api }) => {
    const newUserResponse = await api
      .path("/users")
      .body({
        user: {
          email: "ssasjdjksdkjoopwid",
          password: "a",
          username: username,
        },
      })
      .clearAuth()
      .postRequest(422); //-ve tests

    console.log(newUserResponse);

    //adding validations..

    //in case of valid length, the error msg property will not be there in the output
    if (username.length == 3 || username.length == 20) {
      expect(newUserResponse.errors).not.toHaveProperty("username");
    } else {
      expect(newUserResponse.errors.username[0]).shouldEqual(
        usernameErrorMessage,
      );
    }
  });
});
//look if we have object inside array, how we're using foreach loop
//general use .. foreach(x => {//logic here})
