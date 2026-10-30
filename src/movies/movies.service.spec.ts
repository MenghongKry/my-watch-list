import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MoviesService } from './movies.service.js';
import { Movie } from './entities/movie.entity.js';
import { MovieCreatedEvent } from './movie-created.event.js';

describe('MoviesService', () => {
  let service: MoviesService;
  
  const moviesRepository = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    merge: vi.fn((movie, changes) => Object.assign(movie, changes)),
  };
  const eventEmitter = { emit: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: moviesRepository },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns every movie from the repository', async () => {
    const movies = [
      { id: 1, title: 'Inception', genre: 'Sci-Fi', watched: false },
      { id: 2, title: 'Spirited Away', genre: 'Animation', watched: true },
    ];
    moviesRepository.find.mockResolvedValue(movies);

    expect(await service.findAll()).toEqual(movies);
  });

  it('findOne returns the movie when it exists', async () => {
    const movie = {
      id: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
      watched: false,
    };
    moviesRepository.findOneBy.mockResolvedValue(movie);

    expect(await service.findOne(1)).toEqual(movie);
    expect(moviesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findOne throws NotFoundException when the movie is missing', async () => {
    moviesRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create saves the movie and emits movie.created', async () => {
    const dto = { title: 'Inception', genre: 'Sci-Fi' };
    moviesRepository.create.mockReturnValue(dto);
    moviesRepository.save.mockResolvedValue({ id: 1, ...dto, watched: false });

    const movie = await service.create(dto);

    expect(movie).toEqual({
      id: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
      watched: false,
    });
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'movie.created',
      new MovieCreatedEvent(1, 'Inception', 'Sci-Fi'),
    );
  });

  it('update changes only the sent fields', async () => {
    moviesRepository.findOneBy.mockResolvedValue({
      id: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
      watched: false,
    });
    moviesRepository.save.mockImplementation(async (movie) => movie);

    const movie = await service.update(1, { watched: true });

    expect(movie).toEqual({
      id: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
      watched: true,
    });
  });

  it('update throws NotFoundException and saves nothing when the movie is missing', async () => {
    moviesRepository.findOneBy.mockResolvedValue(null);

    await expect(service.update(99, { watched: true })).rejects.toThrow(
      NotFoundException,
    );
    expect(moviesRepository.save).not.toHaveBeenCalled();
  });

  it('remove throws NotFoundException when nothing was deleted', async () => {
    moviesRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
