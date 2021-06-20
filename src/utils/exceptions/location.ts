import { BadRequestException, ResourceNotFoundException } from './root';

class LocationNotFoundException extends ResourceNotFoundException{
  constructor(id?: number) {
    super(`Location with details ${id ?? 'provided'} wasn't found`);
  }
}

class LocationWithCoordAlreadyExistException extends BadRequestException {
  constructor() {
    super('Location with specified geo coordinates already exist');
  }
}
export { LocationNotFoundException, LocationWithCoordAlreadyExistException };
