export class ShortLink {
  private _id: number;
  private _targetLink: string;
  private _shortenedLink: string;
  private _userId: number;
  private _count: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date;

  constructor() {
    this._createdAt = new Date();
    this._updatedAt = null;
    this._deletedAt = null;
  }

  get id() {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get targetLink() {
    return this._targetLink;
  }

  set targetLink(targetLink: string) {
    this._targetLink = targetLink;
  }

  get shortenedLink() {
    return this._shortenedLink;
  }

  set shortenedLink(shortenLink: string) {
    this._shortenedLink = shortenLink;
  }

  get userId() {
    return this._userId;
  }

  set userId(userId: number) {
    this._userId = userId;
  }

  get count() {
    return this._count;
  }

  set count(count: number) {
    this._count = count;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  set deletedAt(deletedAt: Date) {
    this._deletedAt = deletedAt;
  }

  createShortLink(input: Partial<ShortLink>): void {
    this.targetLink = input.targetLink;
    this.shortenedLink = this.generateShortenedLink();
    this.userId = input.userId;
    this.createdAt = new Date();
  }

  updateShortLink(input: Partial<ShortLink>): void {
    this.targetLink = input.targetLink || this.targetLink;
    this.updatedAt = new Date();
  }

  setShortLink(input: Partial<ShortLink>): void {
    this.id = input.id;
    this.targetLink = input.targetLink;
    this.shortenedLink = input.shortenedLink;
    this.userId = input.userId;
    this.count = input.count;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.deletedAt = input.deletedAt;
  }

  setDomainInShortenedLink(code: string) {
    return `${process.env.DOMAIN_URL || 'localhost:3000'}/${code}`;
  }

  private generateShortenedLink(): string {
    const charactres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += charactres.charAt(
        Math.floor(Math.random() * charactres.length),
      );
    }
    return this.setDomainInShortenedLink(result);
  }

  addCount(): void {
    this.count += 1;
  }
}
