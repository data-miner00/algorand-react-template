import React from "react";
import { getVariable, Variable } from "../utils/getVariable";

function Profile(): JSX.Element {
  return (
    <>
      <h1>
        Profile page {getVariable(Variable.REACT_APP_SECRET)} -{" "}
        {getVariable<number>(Variable.REACT_APP_NUMBER)}
      </h1>
    </>
  );
}

export default Profile;
