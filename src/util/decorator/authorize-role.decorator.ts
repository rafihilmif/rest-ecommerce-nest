import { SetMetadata } from '@nestjs/common';

export const AuthorizeRole = (...role: string[]) =>
  SetMetadata('allowedrole', role);
