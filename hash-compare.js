import bcrypt from 'bcrypt';

const hashedPassword =
  '$2b$12$ITx6sy5Jd9tAqwUOK.Kg1OTHONpZ2jcYOhAk17Pn65klkmD0JeYQi';
const password = 'x1YaB72x.*';

bcrypt.compare(password, hashedPassword, (err, isValid) => {
  if (err) {
    console.log(err);
  } else {
    console.log(isValid);
  }
});
