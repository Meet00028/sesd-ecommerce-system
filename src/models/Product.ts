export class Product {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _stock: number;

  constructor(id: string, name: string, description: string, price: number, stock: number) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._stock = stock;
  }

  public get id(): string { return this._id; }
  
  public get name(): string { return this._name; }
  public set name(value: string) { this._name = value; }

  public get description(): string { return this._description; }
  public set description(value: string) { this._description = value; }

  public get price(): number { return this._price; }
  public set price(value: number) {
    if (value < 0) throw new Error('Price cannot be negative');
    this._price = value;
  }

  public get stock(): number { return this._stock; }
  public set stock(value: number) {
    if (value < 0) throw new Error('Stock cannot be negative');
    this._stock = value;
  }

  public toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      stock: this._stock,
    };
  }
}
