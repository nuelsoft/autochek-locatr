import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './location.entity';
import { Response } from '../utils/response';
import {
  LocationNotFoundException,
  LocationWithCoordAlreadyExistException,
} from '../utils/exceptions/location';
import { LocationUpdateRequest } from '../utils/requests/location';

@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get()
  async all(): Promise<Response<Location[]>> {
    return new Response<Location[]>({
      message: 'locations retrieved',
      data: await this.locationService.getAll(),
    });
  }

  @Get('/:id/fetch')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<Location>> {
    const location = await this.locationService.getOne(id);
    if (!location) throw new LocationNotFoundException(id);
    return new Response({
      message: 'location retrieved',
      data: location,
    });
  }

  @Get('/coords')
  async findOneByCoords(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
  ): Promise<Response<Location>> {
    const location = await this.locationService.getOneByCoords({
      lat: lat,
      lon: lon,
    });
    if (!location) throw new LocationNotFoundException();
    return new Response({
      message: 'location retrieved',
      data: location,
    });
  }

  @Get('/distance')
  async calculateDistance(
    @Query('begin', ParseIntPipe) begin: number,
    @Query('end', ParseIntPipe) end: number,
  ): Promise<Response<{ distance: number; unit: string }>> {
    const startLocation = await this.locationService.getOne(begin);
    if (!startLocation) throw new LocationNotFoundException(begin);
    const finishLocation = await this.locationService.getOne(end);
    if (!finishLocation) throw new LocationNotFoundException(end);

    const R = 6371e3; // metres [Earth's Radius]
    const startLatitude = (startLocation.lat * Math.PI) / 180;
    const finishLatitude = (finishLocation.lat * Math.PI) / 180;
    const latitudeDelta =
      ((finishLocation.lat - startLocation.lat) * Math.PI) / 180;
    const longitudeDelta =
      ((finishLocation.lon - startLocation.lon) * Math.PI) / 180;

    const a =
      Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
      Math.cos(startLatitude) *
        Math.cos(finishLatitude) *
        Math.sin(longitudeDelta / 2) *
        Math.sin(longitudeDelta / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return new Response({
      message: 'distance computed',
      data: {
        distance: d,
        unit: 'meters',
      },
    });
  }

  @HttpCode(201)
  @Post('/new')
  async create(@Body() location: Location): Promise<Response<Location>> {
    if (
      await this.locationService.getOneByCoords({
        lat: location.lat,
        lon: location.lon,
      })
    )
      throw new LocationWithCoordAlreadyExistException();
    return new Response({
      data: await this.locationService.create(location),
      message: 'location created',
    });
  }

  @Patch('/:id/update')
  async update(
    @Body() location: LocationUpdateRequest,
    @Param('id') id: number,
  ): Promise<Response<Location>> {
    const update = await this.locationService.update(id, location);
    if (!update) throw new LocationNotFoundException(id);
    return new Response({
      message: 'location updated',
      data: update,
    });
  }

  @Delete('/:id/delete')
  async remove(@Param('id', ParseIntPipe) id): Promise<Response<string>> {
    const deleted = await this.locationService.delete(id);
    if (!deleted) throw new LocationNotFoundException(id);
    return new Response({
      message: 'location deleted',
    });
  }
}
