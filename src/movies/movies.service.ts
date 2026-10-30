import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Movie } from './entities/movie.entity.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { MovieCreatedEvent } from './movie-created.event.js';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private eventEmitter: EventEmitter2,
  ) {}

  findAll() {
    return this.moviesRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) {
      this.logger.warn(`Movie ${id} was requested but does not exist`);
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const movie = await this.moviesRepository.save(
      this.moviesRepository.create(createMovieDto),
    );
    this.eventEmitter.emit(
      'movie.created',
      new MovieCreatedEvent(movie.id, movie.title, movie.genre),
    );
    return movie;
  }

  async update(id: number, changes: UpdateMovieDto) {
    const movie = await this.findOne(id);
    this.moviesRepository.merge(movie, changes);
    return this.moviesRepository.save(movie);
  }

  async remove(id: number) {
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Movie ${id} was requested but does not exist`);
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return { message: 'Movie deleted' };
  }
}
