import { User, Admin, Customer } from '../models/User';
import { IUserRepository } from '../repositories/UserRepository';

export class UserService {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async createAdmin(id: string, email: string, name: string): Promise<User> {
    const admin = new Admin(id, email, name);
    return this._userRepository.save(admin);
  }

  async createCustomer(id: string, email: string, name: string, address: string): Promise<User> {
    const customer = new Customer(id, email, name, address);
    return this._userRepository.save(customer);
  }

  async getUserById(id: string): Promise<User | null> {
    return this._userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this._userRepository.findByEmail(email);
  }
}
