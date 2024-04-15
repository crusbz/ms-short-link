import { hash } from 'bcrypt';
import { ShortLink } from 'src/short-link/entities/short-link.entity';

export class User {
  private _id: number;
  private _name: string;
  private _email: string;
  private _shortenedLinks?: ShortLink[];
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date;

  constructor() {
    this._createdAt = new Date();
    this._updatedAt = null;
    this._deletedAt = null;
  }

  set id(id: number) {
    this._id = id;
  }
  set name(name: string) {
    this._name = name;
  }

  set email(email: string) {
    this._email = email;
  }

  set password(password: string) {
    this._password = password;
  }

  set shortenedLinks(shortenedLinks: ShortLink[]) {
    this._shortenedLinks = shortenedLinks;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  set deletedAt(deletedAt: Date) {
    this._deletedAt = deletedAt;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get shortenedLinks() {
    return this._shortenedLinks;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  async createUser(input: Partial<User>): Promise<void> {
    this.name = input.name;
    this.email = input.email;
    this.password = await hash(input.password, 10);
  }

  updateUser(input: Partial<User>): void {
    this.name = input.name || this.name;
    this.email = input.email || this.email;
    this.password = input.password || this.password;
    this.updatedAt = new Date();
  }

  setUser(input: Partial<User>): void {
    this.id = input.id;
    this.name = input.name;
    this.email = input.email;
    this.shortenedLinks = input.shortenedLinks;
    this.password = input.password;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.deletedAt = input.deletedAt;
  }
}
