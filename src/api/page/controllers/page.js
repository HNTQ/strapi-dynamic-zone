"use strict";

/**
 * page controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const uid = "api::page.page";

const components = {
  content: {
    populate: {
      image: {
        populate: "*",
      },
      left: {
        populate: "*",
      },
      right: {
        populate: "*",
      },
      src: {
        populate: "*",
      },
      type: true,
    },
  },
};

module.exports = createCoreController(uid, () => {
  return {
    async find(ctx) {
      // overwrite default populate=* functionality
      if (ctx.query.populate === "*") {
        const entity = await strapi.entityService.findMany(uid, {
          ...ctx.query,
          populate: components,
        });
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      }
      // maintain default functionality for all other request
      return super.find(ctx);
    },
    async findOne(ctx) {
      const { id } = ctx.request.params;

      if (ctx.query.populate === "*") {
        const entity = await strapi.entityService.findOne(uid, id, {
          ...ctx.query,
          populate: components,
        });
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      }

      return super.findOne(ctx);
    },
  };
});
