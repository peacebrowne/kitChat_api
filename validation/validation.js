import { signInValidation, writeData } from "../repositories/repositories.js";

const signIn = async (data) => {
  const info = JSON.parse(data);
  const result = await signInValidation(info.email);
  if (!result) return "false";

  return result.email === info.email && result.password === info.password
    ? "true"
    : "false";
};

const email = async (data) => {
  const info = JSON.parse(data);
  const result = await signInValidation(JSON.parse(info.email));
  if (!result) return "false";
};

const signUp = async (data) => {
  const info = JSON.parse(data);
  const result = await signInValidation(info.email);
  if (result) return { msg: "User Already Exit!", status: "false" };
  return { msg: await writeData(data), status: "true" };
};

export { signIn, signUp };
