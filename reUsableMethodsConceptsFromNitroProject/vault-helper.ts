//import hostname etc from config file...

//look how edefining the variable type here.. it's basically our own custom type..
type Pri = string | number | boolean;

export function getNitroVaultPath(role: string) {
  const vaultPath: string = ""; //take this from someconfig file..
  //do the logic here..

  //IMPORTANT LINE:::
  const response: any = "";
  //check the logic below.. (ask gemini how it works)
  const secret: string = response.body.data.secret || response.body.data.value;
}
