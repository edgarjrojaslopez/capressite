import bcrypt from 'bcrypt';

const hashedPassword =
  '$2b$12$ITx6sy5Jd9tAqwUOK.Kg1OTHONpZ2jcYOhAk17Pn65klkmD0JeYQi';

const rounds = bcrypt.getRounds(hashedPassword);
console.log(rounds); // 10
