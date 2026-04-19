export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export abstract class User {
  private _id: string;
  private _email: string;
  private _name: string;
  protected _role: UserRole;

  constructor(id: string, email: string, name: string, role: UserRole) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._role = role;
  }

  // Encapsulation: Getters and Setters
  public get id(): string { return this._id; }
  
  public get email(): string { return this._email; }
  public set email(value: string) {
    if (!value.includes('@')) throw new Error('Invalid email');
    this._email = value;
  }

  public get name(): string { return this._name; }
  public set name(value: string) {
    if (value.length < 2) throw new Error('Name too short');
    this._name = value;
  }

  public get role(): UserRole { return this._role; }

  // Abstract method to show polymorphism in later phases if needed
  public abstract getPermissions(): string[];

  public toJSON() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      role: this._role,
    };
  }
}

export class Admin extends User {
  constructor(id: string, email: string, name: string) {
    super(id, email, name, UserRole.ADMIN);
  }

  public getPermissions(): string[] {
    return ['MANAGE_PRODUCTS', 'MANAGE_ORDERS', 'VIEW_USERS'];
  }
}

export class Customer extends User {
  private _address: string;

  constructor(id: string, email: string, name: string, address: string) {
    super(id, email, name, UserRole.CUSTOMER);
    this._address = address;
  }

  public get address(): string { return this._address; }
  public set address(value: string) { this._address = value; }

  public getPermissions(): string[] {
    return ['VIEW_PRODUCTS', 'PLACE_ORDERS', 'VIEW_OWN_ORDERS'];
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      address: this._address,
    };
  }
}
