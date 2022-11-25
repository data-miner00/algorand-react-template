export enum Variable {
  REACT_APP_ALGORAND_APPID = "REACT_APP_ALGORAND_APPID",
}

export function getVariable<T = string>(variable: Variable): T {
  return process.env[variable] as T;
}
