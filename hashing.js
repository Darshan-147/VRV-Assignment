// This is created to retrieve the hash values of passwords!

const bcrypt = require('bcrypt');

// Hashing function
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Credentials
const users = [
  { username: "Darshan", password: "260503", role: "student" },
  { username: "Mumma", password: "Mumma123", role: "admin" }
];

// Hashing passwords for each user
const hashedUsers = async () => {
  for (let user of users) {
    user.password = await hashPassword(user.password); // Hashing the password
  }

  console.log(users);  // Output the users with hashed passwords
};

// Call the function to hash the passwords
hashedUsers();
