import {
  signInValidation,
  writeData,
  readMessages,
  readData,
  // previousMessages,
} from "../repositories/repositories.js";
import { v4 as uuidv4 } from "uuid";

import nodemailer from "nodemailer";

const signIn = async (data) => {
  const { email, password } = JSON.parse(data);
  const result = await signInValidation(email);
  if (!result) return false;

  return result.email === email && result.password === password
    ? result.id
    : false;
};

const privateMessages = async (userID, friendID) => {
  const messages = await readMessages();
  const privateMessage = messages.filter(
    (msg) =>
      (msg.from === userID && msg.to === friendID) ||
      (msg.from === friendID && msg.to === userID)
  );

  if (privateMessage.length) {
    for (const message of privateMessage) {
      const [date, time] = message.timestamp.split(" ");
      const [year, month, day] = date.split("-");
      const [hour, minute, second] = time.split(":");
      const datetime = {
        date: {
          year,
          month,
          day,
        },
        time: {
          hour,
          minute,
          second,
        },
      };
      message["datetime"] = datetime;
    }
    return privateMessage;
  }

  return [];
};

const previousConversations = async (id) => {
  const users = await readData();
  const latestMessages = [];

  for (const user of users) {
    const messages = await privateMessages(id, user.id);

    if (messages.length) {
      const latestMessage = messages[0];

      latestMessages.push({
        fullname: user.fullname,
        id: user.id,
        color: user.color,
        latestMessage,
      });
    } else if (user.id !== id) {
      latestMessages.push({
        fullname: user.fullname,
        id: user.id,
        color: user.color,
        latestMessage: {
          timestamp: "",
          message: "",
          datetime: {
            date: {
              year: "",
              month: "",
              day: "",
            },
            time: {
              hour: "",
              minute: "",
              second: "",
            },
          },
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
      if (
        latestMessages[j].latestMessage.id < latestMessages[i].latestMessage.id
      ) {
        latestMessages[i] = latestMessages[j];
        latestMessages[j] = temp;
      }
    }
  }

  return latestMessages.reverse();
};

const mostRecentMessages = (message, latestMessage) => {
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

const resetPassword = async (mail) => {
  const data = JSON.parse(mail);
  const result = await signInValidation(data.email);

  return result
    ? emailUser(data.email)
    : {
        msg: "There is no account with that email address.",
        status: false,
      };
};

const emailUser = async (email) => {
  console.log(email);

  const transporter = nodemailer.createTransport({
    host: "mail.gmail.com",
    port: 587,
    secure: true,
    service: "Gmail",
    auth: {
      user: "echoes832@gmail.com",
      pass: "S3CCbK5guWPY4c",
    },
  });

  // Email content
  const mailOptions = {
    from: '"Nodemailer Contact" <echoes832@gmail.com>',
    to: email,
    subject: "Password Reset Confirmation",
    html: `<p>If this was a mistake, ignore this email and nothing will happen</p>.
          <h5>To reset your password, visit the following address:</h5>
          <a href="https://liberiabankers.org/wp-login.php?action=rp&key=2t0j9qOgnaKvZ4Rx1zGG&login=lba&wp_lang=en_US">
            https://liberiabankers.org/wp-login.php?action=rp&key=2t0j9qOgnaKvZ4Rx1zGG&login=lba&wp_lang=en_US
          </a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      msg: "Check your email for the confirmation link, then visit it.",
      status: true,
    };
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export {
  signIn,
  signUp,
  resetPassword,
  privateMessages,
  previousConversations,
};
