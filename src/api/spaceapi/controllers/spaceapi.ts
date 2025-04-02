import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx: Context) {
    const hackspace = await strapi.documents('api::hackspace.hackspace')
      .findFirst({
        populate: "*",
      });

    return ctx.send(hackspace);
  },
});
