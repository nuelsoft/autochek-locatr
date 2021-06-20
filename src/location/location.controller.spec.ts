import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { Repository } from 'typeorm';
import { LocationWithCoordAlreadyExistException } from '../utils/exceptions/location';
import { HttpException } from '@nestjs/common';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService,
        { provide: getRepositoryToken(Location), useClass: Repository },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  describe('All Locations', () => {
    it('should return an array of locations', async () => {
      const list = [];
      jest.spyOn(service, 'getAll').mockImplementation(async () => list);
      expect((await controller.all()).data).toBe(list);
    });
  });

  describe('Location Find', () => {
    it('should find location', async () => {
      const location = new Location();
      location.name = 'name';
      jest.spyOn(service, 'getOne').mockImplementation(async () => location);
      expect((await controller.findOne(1)).data).toHaveProperty('name');
    });
  });

  describe('New Location with no existing coords', () => {
    it('should succeed', async () => {
      const location = new Location();

      jest
        .spyOn(service, 'getOneByCoords')
        .mockImplementation(async () => null);

      jest.spyOn(service, 'create').mockImplementation(async () => {
        location.name = 'name';
        return location;
      });

      expect((await controller.create(location)).data).toHaveProperty('name');
    });

    describe('Get distance calculation', () => {
      it('should succeed', async () => {
        const location = new Location();

        location.lon = 0;
        location.lat = 0;

        jest.spyOn(service, 'getOne').mockImplementation(async () => {
          location.name = 'name';
          return location;
        });

        expect((await controller.calculateDistance(0, 0)).data).toHaveProperty(
          'distance',
        );
      });
    });
  });
});
