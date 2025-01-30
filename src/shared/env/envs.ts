import { BadRequestException } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

interface IEnvs {
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object<IEnvs>({
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new BadRequestException(error.message);
}

const envVars: IEnvs = value;

export const envs = {
  NATS_SERVERS: envVars.NATS_SERVERS,
};
