import { HttpException, HttpStatus } from '@nestjs/common';

class ResourceNotFoundException {
  constructor(message?: string) {
    return new HttpException(
      {
        error: true,
        message: message ?? "Requested resource wasn't found",
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

class BadRequestException {
  constructor(message?: string) {
    return new HttpException(
      {
        error: true,
        message: message ?? 'Malformed request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export { BadRequestException, ResourceNotFoundException };
