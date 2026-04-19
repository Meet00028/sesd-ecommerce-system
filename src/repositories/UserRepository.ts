import { User } from '../models/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
}

export class UserRepository implements IUserRepository {
  private _users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this._users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(this._users.values()).find(u => u.email === email) || null;
  }

  async save(user: User): Promise<User> {
    this._users.set(user.id, user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this._users.values());
  }
}
