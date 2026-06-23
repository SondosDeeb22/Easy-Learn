import { Test, TestingModule } from '@nestjs/testing';
import { OfferedCoursesController } from './offered-courses.controller';
import { OfferedCoursesService } from './offered-courses.service';

describe('OfferedCoursesController', () => {
  let controller: OfferedCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferedCoursesController],
      providers: [OfferedCoursesService],
    }).compile();

    controller = module.get<OfferedCoursesController>(OfferedCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
