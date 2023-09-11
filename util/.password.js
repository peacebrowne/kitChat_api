const encrypt_password = (id, pwd) => {
  const text = id.split("-").join("");
  const key = Math.floor(Math.random() * text.length);
  console.log({ pwd, key, text });
};

function substition_ceipher(text, key, pwd) {
  const length = text.length;

  for (let i = 0; i < length; i++) {
    if (text[i] === text[i].toUpperCase()) {
      rotate(text[i], key, 65);
    } else if (text[i] === text[i].toLowerCase()) {
      rotate(text[i], key, 97);
    } else {
    }
  }
}

function rotate(letter, key, ascii) {
  value = key[letter - ascii];
  return ascii == 65 ? toupper(value) : tolower(value);
}

export { encrypt_password };
