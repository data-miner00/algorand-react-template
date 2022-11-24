export enum Variable {
  REACT_APP_SECRET = "REACT_APP_SECRET",
  REACT_APP_NUMBER = "REACT_APP_NUMBER",
}

export function getVariable<T = string>(variable: Variable): T {
  return process.env[variable] as T;
}
