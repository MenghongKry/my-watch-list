export class MovieCreatedEvent {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly genre: string,
  ) {}
}
