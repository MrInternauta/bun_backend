import Joi from 'joi';

export const config = {
  SERVER_PORT: process.env.SERVER_PORT,
  SERVER_HOST: process.env.SERVER_HOST,
  MYSQL_BD_NAME: process.env.MYSQL_BD_NAME,
  MYSQL_ROOT_NAME: process.env.MYSQL_ROOT_NAME,
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
};

export const schema = Joi.object({
  SERVER_PORT: Joi.number().integer().min(1000).max(9000).required(),
  SERVER_HOST: Joi.string().required(),
  MYSQL_BD_NAME: Joi.string().required(),
  MYSQL_ROOT_NAME: Joi.string().required(),
  MYSQL_ROOT_PASSWORD: Joi.string().required(),
});
