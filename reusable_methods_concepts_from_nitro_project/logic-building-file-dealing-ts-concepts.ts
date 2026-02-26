//import person from '../test-data/admin-event-result-entity-view-002-person.json' with {type: 'json'};
//import eventV3 from '../test-data/admin-event-result-entity-view-002-event-v3-iabs-facial-refdt-encounter.json' with {type: 'json'}

import { readdir, readFile } from "fs/promises";
import { join } from "path";

const dir = "/Users/2105775/Tools/Automation/pw-test/test-data";

//console.log(person.internal_handle.interface_identifier);
//console.log(eventV3.identifiers.SERVICE_DELIVERY)

let files: string[];

const entries = await readdir(dir, { withFileTypes: true });
files = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b))
  .filter((f) => f.toLowerCase().includes("v3"));

console.log(files.length);

const data: Record<string, any> = {};

// const data = [];
// const f1 = 'admin-event-result-entity-view-002-artefact-event-v3-dgp-audit1.json'
// const fullPath = join(dir, f1);
// const t1 = await readFile(fullPath,"utf8");
// const j1 = JSON.parse(t1);
// console.log(j1);

for (const file of files) {
  const fullPath = join(dir, file);
  const text = await readFile(fullPath, "utf8");
  //const json = JSON.parse(text);
  data[file] = JSON.parse(text);
  //data.push(json);
}

type LinkedFileInfo = { id: string; event_type?: any };

//const all_v3_files_linked_to_identity : Record< string, any> = [];

const all_v3_files_linked_to_identity: Record<string, LinkedFileInfo> = {};

//logic to pick the file name which have
for (const [fileName, content] of Object.entries(data)) {
  const id = content?.identifiers?.IDENTITY?.interface_identifier;
  if (id) {
    //console.log(fileName, id);
    // all_v3_files_linked_to_identity[fileName]  = (id);
    all_v3_files_linked_to_identity[fileName] = {
      id: id,
      event_type: content?.event_type,
    };
  }
}

//console.log(all_v3_files_linked_to_identity)

//now find out which of these files have linked to this

//loop through this new array
//and compare the content with the first identity to find out if it's link or not..
//first ID::

let count: number = 0;
for (const [fileName, content] of Object.entries(
  all_v3_files_linked_to_identity,
)) {
  //console.log('content is: ' , content)
  const id = "CID_PEOPLE_{{RANDOM_INT.INT_VAL}}";
  //  if (id === content) {
  //         count++;
  //         console.log(fileName , ' : ' , id, ' event type: ' , );
  //    }

  if (id === content.id) {
    count++;
    console.log(fileName, ":", id, " event type: ", content.event_type);
  }
}

console.log("count: " + count);
