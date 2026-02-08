very important website with cool playwright tips and tricks.
once you're ready with playwright - go through this: https://playwrightsolutions.com/

also check this out:
https://playwrightsolutions.com/is-it-possible-to-do-api-testing-with-playwright-the-definitive/

for schema validation , we have converted our reponse to schema using: https://transform.tools/json-to-json-schema
also download node pkg: ajv.js x`
schema generator lib: npm i genson-js

difference between , node, npm, npx..
why we have npm install --save-dev @faker-js/faker (--save-dev)..
also when others will run this using npx and this faker lib is part of package.json, it will
downlaod all dependencies by default.. is this correct understanding right?
difference between package-locl.json vc package.json..
//also when we share the project, does it downlaod the dependencies again right seeing which file..

###ABOUT THE PROJECT###
download the following extensions before starting a playwright projects
playwright test extension
cucumber
pretty --> also to make sure it's applied in the complier (google it)
Material icon theme

Demo APP URL : https://conduit.bondaracademy.com/
Abhi21sharma/Abhi21sharma@test.com/abhi@test

well if we have 'pretty' extension enabled , it will work all by it's own but if we don't have then , to format a file: use below:
MAc - control + shift+ F
windows - control + shift + I (format of file)

fluent framework --> see utils -> request-handler.ts file for details..
Test fixture --> it's a function, work as pre-condition, tear down for our tests.. more than test hooks..
how it's better than hooks, let's say, test1 and test3 needs a token A , so we add them in beforeEach() hooks but test 2 and test4 also needs a token but it's a different token B.
now we have to group our tests differently and strategily , but the easiest way in this case is
to use fixtures
https://playwright.dev/docs/test-fixtures

Note: After sometime , couldn't document everything in READMe. but we can check the individual files added and read the comments for deatails to know why we added this and how to use this..

Test Management:

Managing paylods --
updating requests payload and then make a put request etc.
refer to folder, requests-objects..
also refer to smoke2Test.spec. ts --> how we imported the file and how we updated the value and also how we handled the post request

TestData Generation -- Random data generator for important fields..
downlaod this lib using: npm install --save-dev @faker-js/faker
check the file smoke3Test.spec.js

Running UI and API Tests together..
folder structure:

tests
|
|-api-tests -apitest1.spec.ts,apitest2.spec.ts
|-ui-tests -smoketests.spec.ts,smoketests2.spec.ts
|-playwright.config.ts

OR if want to use the same config file..
create seperate projects .. and set the dir within the projects..
and make sure to add use block and provide the default browerType for ui-tests

ENVIORNMENT VARIABLES...
(very important video and file is api-test.config.ts)
how do we red it as a normal config.jsonas a json file
and also how to use it as fixture

1. check the file: api-test.config.ts.. (look how we exported it)
2. check the upadates in api-test-updated.config.ts .. look how it is different from above file..
   (adding .env file to send the arguments by defeault)
   priority is: use .env variable secrets but if something comes from command line, they hold the highest priority and it overrides what's in the .env
   also add.env to be added to the git ignore

some key things..
when we define a variable in TS
const fName: string = 'value' -- ok
but const fName: string ; -- not ok as it's undefined (so either defined this inconstructor of class)
or we can say liek
const fName? : string ; //this meeans that it can be undefined
or
const fName : string | undefined; explicitly saying it is undefined..
or const fName : typeOf string .. (this syntax is used in fixture.ts config: typeof config; )

also if it's an object instead of string.. and we want to add or remove or update some of it's value
look at api-test-updated.config.ts file, how we have handled it
const config = {key1= 'value',
key2 ='value'
}
..if we want to update the value from ENV VARIABLE and in that case
TS doesn't know what value it will recieve, string , array etc..
it wants us to tell in advance..

pipe operator in TS:
(it's called UNION operator)
. logical OR
assigned the left side if it's not falsy
otherwise (false - null - undefined) , assign the value right
// If 'secret' is missing/null, use 'value'
const secret: string = response.body.data.secret || response.body.data.value;

same way, another example:
// If the environment variable isn't set, default to 'chromium'
const browser = process.env.BROWSER || 'chromium';

//in IF block -> same as java (logical OR )
if (status === 'passed' || status === 'skipped') {
console.log('Test did not fail');
}

single Type -> | -> union type
for flexible data types::
it defiens a variable to hold value of more than 1 type
let test Id: string | number | boolean;
test ID = "TC-101"
test ID = 101
test ID = true

String Literal Unions it's a 'ENUM' REPLACEMENT --> and custom type

type TestStatus = 'passed' | 'failed' | 'flaky' | 'timedOut';

now TestStatus can be anothing from above list and nothing else..

What is : Record<K,V> : It's a utility type which is used to define the structure of the object
where we know the 'types of the key and value'
// The Type definition
const userRoles: Record<string, string> = {
admin: "All Access",
tester: "Execution Only",
guest: "Read Only"
};

//before record ,we used to use 'index signatures' :

// Index Signature (Older style)
type UserTypeA = { [key: string]: number };

// Record (Modern, cleaner style)
type UserTypeB = Record<string, number>;

//best use case:
type Environment = 'dev' | 'staging' | 'prod';

// TS will throw an error if you forget one of the environments below
const urls: Record<Environment, string> = {
dev: "https://dev.example.com",
staging: "https://staging.example.com",
prod: "https://example.com"
};

difference between || and ??
both are used for 'fallback' values , when one of the expression value is falsy/null/undefined

so , || -> this operator returns the right hand value, if the left hand side is falsy
what is falsy in TS/JS ?
null or undefined
false
0
""
NaN
The risk with || --> even in some case our test returns 0 or blank string "", this will be considered as false so this expression will return right hand side. but this is something we may not want. Like in case of css.innerText() returns a empty string OR a retry count in playwright.config.ts count is 0 but it doesn't make them false.

?? --> introduced in 2020, is more strict type, is only returns the right hand side if the left hand side is nullish. which is Null or undefined.
it trets false, 0 and "" as valid values..

example:
// Scenario: Getting a timeout value from a config file
const customTimeout: number | undefined = config.timeout;

// Using || (Dangerous)
// If customTimeout is 0, this results in 30000
const finalTimeoutOR = customTimeout || 30000;

// Using ?? (Safe/Best Practice)
// If customTimeout is 0, this results in 0
const finalTimeoutNullish = customTimeout ?? 30000;

IMPORTANT --> look at files --> data-generator.ts and smoketests2.spec.ts for details
one of the biggest problem JS or TS solved is searlized and de-searlized the data (JSON)
that's why JSON is JS object notation..
here with JS/TS ,
a. we can directly update the JSON node value
b. we don't have to explictly loop through the json structure to get that json key we want to update
c. we don't have to save to the payload file the updated node(jsonkeys)
d. object will be updated autoamtically, and ready to send over
e. json.Stringify() and json.parse() and more precisely structuredClone() methods are best
f. can also directly read the value from DOT notation
g. main is updating using DOT notation and that's it whole JSON object (payload is updated)
