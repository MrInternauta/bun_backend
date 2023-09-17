import Joi from 'joi';

export class Config {
  public static get config() {
    return {
      SERVER_PORT: process.env.SERVER_PORT || 5000,
      SERVER_HOST: process.env.SERVER_HOST || '',
      DATABASE_URL: process.env.DATABASE_URL || '',
      EXPIRE_TOKEN: process.env.EXPIRE_TOKEN || '',
      JWT_SEED: process.env.JWT_SEED || '',
      SALTROUNDS: process.env.SALTROUNDS || 10,
    };
  }

  public static get schema() {
    return Joi.object({
      SERVER_PORT: Joi.number().integer().min(1000).max(9000).required(),
      SERVER_HOST: Joi.string().required(),
      DATABASE_URL: Joi.string().required(),
      EXPIRE_TOKEN: Joi.string().required(),
      JWT_SEED: Joi.string().required(),
      SALTROUNDS: Joi.number().integer().min(5).max(12).required(),
    });
  }
}
