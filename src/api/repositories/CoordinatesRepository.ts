import { EntityRepository, Repository } from 'typeorm';

import { Coordinates } from '../models/Coordinates';

@EntityRepository(Coordinates)
export class CoordinatesRepository extends Repository<Coordinates>  {}
