import { Test, TestingModule } from '@nestjs/testing';
import { OfferedCoursesService } from './offered-courses.service';

describe('OfferedCoursesService', () => {
  let service: OfferedCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferedCoursesService],
    }).compile();

    service = module.get<OfferedCoursesService>(OfferedCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
