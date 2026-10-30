import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MovieCreatedEvent } from '../movie-created.event.js';

@Injectable()
export class MovieCreatedListener {
  private readonly logger = new Logger(MovieCreatedListener.name);
  private addedCount = 0;

  @OnEvent('movie.created')
  handleMovieCreated(event: MovieCreatedEvent) {
    this.addedCount++;
    this.logger.log(
      `New movie on the watchlist: #${event.id} "${event.title}" (${event.genre}). Added since start: ${this.addedCount}`,
    );
  }
}
