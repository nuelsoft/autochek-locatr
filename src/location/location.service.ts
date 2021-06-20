import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { Repository } from 'typeorm';
import { LocationUpdateRequest } from '../utils/requests/location';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async getAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async getOne(id: number): Promise<Location> {
    return this.locationRepository.findOne(id);
  }

  async getOneByCoords(query: { lat: number; lon: number }): Promise<Location> {
    return this.locationRepository.findOne(query);
  }

  async create(locationData: Location): Promise<Location> {
    return this.locationRepository.save(locationData);
  }

  async delete(id: number): Promise<boolean> {
    return !!(await this.locationRepository.delete(id)).affected;
  }

  async update(
    id: number,
    locationData: LocationUpdateRequest,
  ): Promise<Location> {
    await this.locationRepository.update(id, locationData);
    return this.getOne(id);
  }
}
