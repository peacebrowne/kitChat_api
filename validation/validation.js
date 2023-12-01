import {
  signInValidation,
  writeData,
  activeSection,
  readMessages,
} from "../repositories/repositories.js";
import { v4 as uuidv4 } from "uuid";

const signIn = async (data) => {
  const { email, password } = JSON.parse(data);
  const result = await signInValidation(email);
  if (!result) return false;

  return result.email === email && result.password === password
    ? result.id
    : false;
};

const cookie = (data) => {
  activeSection({ email: data.email, status: true });
  return {
    session: `session=${data.email.split("@")[0]}; Max-Age=3600; Path=/`,
    status: data.id,
  };
};

const logOut = async (cookie) => {
  delete activeSection[cookie];
  return true;
};

const privateMessages = async (from, to) => {
  const messages = await readMessages();
  return messages.filter(
    (msg) =>
      (msg.from === from && msg.to === to) ||
      (msg.from === to && msg.to === from)
  );
};

const email = async (data) => {
  const { email } = JSON.parse(data);
  const result = await signInValidation(email);
  if (!result) return { status: false };
};

const signUp = async (data) => {
  const info = JSON.parse(data);
  const result = await signInValidation(info.email);
  info["id"] = uuidv4();

  return result
    ? { msg: "User Already Exit!", status: false }
    : { msg: await writeData(info), status: true };
};

export { signIn, signUp, logOut, privateMessages };
