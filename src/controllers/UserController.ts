import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { id, email, name, role, address } = req.body;
      let user;

      if (role === 'ADMIN') {
        user = await this._userService.createAdmin(id, email, name);
      } else {
        user = await this._userService.createCustomer(id, email, name, address || '');
      }

      res.status(201).json(user.toJSON());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const user = await this._userService.getUserById(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user.toJSON());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
