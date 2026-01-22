import fs from "fs/promises"; //to deal with files
import path from "path";
import { Ajv } from "ajv";
import { createSchema } from "genson-js";

const SCHEMA_BASE_PATH = "./response-schemas";
const ajv = new Ajv({ allErrors: true });

export async function validateSchema(
  dirName: string,
  fileName: string,
  response: object,
  createSchemaFlag: boolean = false,
) {
  const schemaPath = path.join(
    SCHEMA_BASE_PATH,
    dirName,
    `${fileName}_schema.json`,
  );

  if (createSchemaFlag) {
    try {
      //this will dynamically create schema for this body
      const generatedSchema = createSchema(response);
      //create folder to save this schema
      fs.mkdir(path.dirname(schemaPath), { recursive: true });
      //create a file and store the schema in this location
      fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4));
    } catch (error: any) {
      throw new Error(`Failed to create schema file:: ${error.message}`);
    }
  }

  const schema = await loadSchema(schemaPath);
  //console.log(schema);

  const validate = ajv.compile(schema);
  //now load the response from the actual API response.. and let this ajv lib to compile and compare it
  const valid = validate(response);
  if (
    !valid
  ) //console.log(validate.errors);//can add more meaningful errors like below..
  {
    throw new Error(
      `Schema validation ${fileName}_schema.json failed: \n` +
        `${JSON.stringify(validate.errors, null, 4)}\n\n` +
        `Actual response body: \n` +
        `${JSON.stringify(response, null, 4)}`,
    );
  }
}

async function loadSchema(schemaPath: string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, "utf-8");
    //console.log("content:: ", schemaContent);
    const schema = JSON.parse(schemaContent);
    return schema;
  } catch (error: any) {
    throw new Error(`Failed to read schema file: ${error.message}`);
  }
}
