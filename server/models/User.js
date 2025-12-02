// server/models/User.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { readUsers, writeUsers } = require('../utils/fileStorage');

class User {
  static async create(userData) {
    const users = readUsers();
    const userExists = users.some(
      (u) => u.email === userData.email || u.username === userData.username
    );

    if (userExists) {
      throw new Error('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    const success = writeUsers(users);

    if (!success) {
      throw new Error('Failed to save user');
    }

    // Remove password before returning
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async findByEmail(email) {
    const users = readUsers();
    return users.find((user) => user.email === email);
  }

  static async findById(id) {
    const users = readUsers();
    return users.find((user) => user.id === id);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async updateById(id, updates) {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    const currentUser = users[index];

    const { password, id: _ignoredId, createdAt, ...allowedUpdates } = updates;

    const updatedUser = {
      ...currentUser,
      ...allowedUpdates,
    };

    users[index] = updatedUser;

    const success = writeUsers(users);

    if (!success) {
      throw new Error('Failed to update user');
    }

    const { password: _removedPassword, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

module.exports = User;