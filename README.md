# 🚀 Modification to handle dynamic zone in components

First, this modification only work for Strapi V4.2 and to be adpated for other version.

This is not validated by Strapi team, so use it at your own risk.

## `installation`

```
npm install
# or
yarn
```

## `Initialize Strapi with custom modifications`

```
npm run strapi-init
# or
yarn strapi-init
```

If this script failed, you can manually copy @strapi folder in node_modules to replace modified files.

Do not replace the whole folder, only the modified files.

After each strapi-init it will necessary to build the admin panel.

## `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

## `start`

Start your application. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run develop
# or
yarn develop
```

# `Example: `

This repository contains an example with the following configuration:

## `Component`

### `Generate new components`

The first step is to create a new component with a dynamic zone field.
Then generate a new empty component called Columns in Grid section, a Title component in Text section and an Image component in Media section.

### `Add Dynamic zone in Grid component.`

in `components/columns/grid/columns.json` file, replace the content by:

```json
{
  "collectionName": "components_grid_columns",
  "info": {
    "displayName": "Columns",
    "icon": "table"
  },
  "options": {},
  "attributes": {
    "left": {
      "type": "dynamiczone",
      "components": ["text.title", "media.image"]
    },
    "right": {
      "type": "dynamiczone",
      "components": ["text.title", "media.image"]
    }
  }
}
```

Refresh your admin panel and you should see a Grid component containing a left and right dynamic zone with title and image components available.

## `Collection`

### `Generate new collection named Page`

Generate a new collection named Page with a Title, a description and a dynamic zone (content).

Add column component in dynamic zone (and other components).

### `Generate an example page containing dynamic zone in content`

- Add a new page.
- Fill the title and description fields.
- In the dynamic zone, add a columns component with a title at right and an image at left dynamic zone.

Add find and findOne permission and check the result in the api:

http://localhost:1337/api/pages/?populate=\*

Dynamic zone are not populated.

## `Update Page controllers for deep populate`

In `api/page/controllers/page.js` file, replace the content by this:

```js
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
```

You can now get a populated page with dynamic zone containg images populated too.

# `Thanks`

Thanks to [@JoshaVayer](https://github.com/joshuaVayer) for his big help and his work on this feature

Original modification on this repository: [WestSolution/Strapi](https://github.com/West-Solutions/strapi/tree/feature/handle-dynamic-zone-in-components)
Check the pull request to know which files are modified and how: [WestSolution/Strapi#1](https://github.com/West-Solutions/strapi/pull/1)

Content-type-builder modification are not included in this repository because not yet functional.

## `TODO`

- [ ] Create an official pluggin for strapi for the last version.
- [ ] Allow creation of component with dynamic zone in content-type-builder using strapi admin panel
