import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity.js';
import { MoviesService } from './movies.service.js';
import { MoviesController } from './movies.controller.js';
import { MovieCreatedListener } from './listeners/movie-created.listener.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), AuthModule],
  controllers: [MoviesController],
  providers: [MoviesService, MovieCreatedListener],
})
export class MoviesModule {}
