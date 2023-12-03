import {
  signInValidation,
  writeData,
  activeSection,
  readMessages,
  readData,
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

const privateMessages = async (userID, friendID) => {
  const messages = await readMessages();
  return messages.filter(
    (msg) =>
      (msg.from === userID && msg.to === friendID) ||
      (msg.from === friendID && msg.to === userID)
  );
};

const previousConversations = async (id) => {
  const users = await readData();
  const latestMessages = [];

  for (const user of users) {
    const messages = await privateMessages(id, user.id);

    if (messages.length > 0) {
      let latestMessage = messages[0];

      for (const message of messages) {
        if (isMessageMoreRecent(message, latestMessage)) {
          latestMessage = message;
        }
      }

      const { year, month, day, hour, minute, second, id } = latestMessage;

      latestMessages.push({
        fullname: user.fullname,
        id: user.id,
        color: user.color,
        message: {
          message: latestMessage.message,
          year,
          month,
          day,
          hour,
          minute,
          second,
          id,
        },
      });
    } else if (user.id !== id) {
      latestMessages.push({
        fullname: user.fullname,
        id: user.id,
        color: user.color,
        message: {
          message: "",
          year: "",
          month: "",
          day: "",
          hour: "",
          minute: "",
          second: "",
          id: 0,
        },
      });
    }
  }
  return sortLatestMessages(latestMessages);
};

const sortLatestMessages = (latestMessages) => {
  const length = latestMessages.length;
  for (let i = 0; i < length; i++) {
    for (let j = i; j < length; j++) {
      const temp = latestMessages[i];
      if (latestMessages[j].message.id < latestMessages[i].message.id) {
        latestMessages[i] = latestMessages[j];
        latestMessages[j] = temp;
      }
    }
  }

  return latestMessages.reverse();
};

const isMessageMoreRecent = (message, latestMessage) => {
  return message.year > latestMessage.year ||
    message.month > latestMessage.month ||
    message.day > latestMessage.day ||
    message.hour > latestMessage.hour ||
    message.minute > latestMessage.minute ||
    message.second > latestMessage.second
    ? true
    : false;
};

const signUp = async (data) => {
  const info = JSON.parse(data);
  const result = await signInValidation(info.email);
  info["id"] = uuidv4();

  return result
    ? { msg: "User Already Exit!", status: false }
    : { msg: await writeData(info), status: true };
};

export { signIn, signUp, logOut, privateMessages, previousConversations };
