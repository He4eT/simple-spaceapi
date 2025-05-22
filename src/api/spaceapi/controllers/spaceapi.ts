import type { Core, UID } from '@strapi/strapi';
import type { Context } from 'koa';

const SPACE_API_VERSION = '15';

/* Utils */

const isEmpty = <A>(x: A): boolean =>
  x == null
    ? true
    : Object.keys(x).length === 0
      ? String(x).length === 0
      : false;

const pickFields =
  (fields: Array<string>) =>
  (obj: Record<string, unknown>): object =>
    Object.fromEntries(
      Object.entries(obj)
        .filter(([k, _]) => fields.includes(k))
        .filter(([_, v]) => !isEmpty(v)),
    );

const dateTimeToUnixtime = (updatedAt: string) => {
  const date = new Date(updatedAt);
  return Math.floor(date.getTime() / 1000);
};

const absoluteURL = (origin: string) => (url: string) =>
  url ? `${origin}${url}` : null;

/* */

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx: Context) {
    const origin = ctx.request.origin;

    const result = {} as Record<string, any>;
    result.api_compatibility = [SPACE_API_VERSION];

    /* */

    const hackspace = await strapi
      .documents('api::hackspace.hackspace')
      .findFirst({
        populate: [
          'logo',
          'location',
          'location.areas',
          'spacefed',
          'cam',
          'contact',
          'contact.keymasters',
          'feeds',
          'feeds.blog',
          'feeds.wiki',
          'feeds.calendar',
          'feeds.flickr',
          'projects',
          'links',
          'membership_plans',
          'linked_spaces',
        ],
      });

    result.space = hackspace.space;
    result.logo = absoluteURL(origin)(hackspace?.logo.url);
    result.url = hackspace.url;

    if (!isEmpty(hackspace.location)) {
      result.location = pickFields([
        'address',
        'lat',
        'lon',
        'timezone',
        'country_code',
        'hint',
      ])(hackspace.location);

      if (!isEmpty(hackspace.location.areas)) {
        result.location.areas = hackspace.location.areas.map(
          pickFields(['name', 'description', 'square_meters']),
        );
      }
    }

    if (!isEmpty(hackspace.spacefed)) {
      result.spacefed = pickFields(['spacenet', 'spacesaml'])(
        hackspace.spacefed,
      );
    }

    if (!isEmpty(hackspace.cam)) {
      result.cam = hackspace.cam.map(({ url }) => url);
    }

    /* */

    const state = await strapi.documents('api::state.state').findFirst({
      populate: ['icon.open', 'icon.closed'],
    });

    if (!isEmpty(state)) {
      result.state = pickFields(['open', 'trigger_person', 'message'])(state);

      result.state.lastchange = dateTimeToUnixtime(String(state.updatedAt));

      if (!isEmpty(state.icon)) {
        result.state.icon = {
          open: absoluteURL(origin)(state.icon?.open.url),
          closed: absoluteURL(origin)(state.icon?.closed.url),
        };
      }
    }

    /* */

    const events = await strapi.documents('api::event.event').findMany({
      sort: { createdAt: 'desc' },
      limit: 10,
    });

    if (!isEmpty(events)) {
      result.events = events.map((event) => ({
        ...pickFields(['name', 'type', 'extra'])(event),
        timestamp: dateTimeToUnixtime(String(event.createdAt)),
      }));
    }

    /* */

    if (!isEmpty(hackspace.contact)) {
      result.contact = pickFields([
        'phone',
        'sip',
        'irc',
        'twitter',
        'mastodon',
        'facebook',
        'identica',
        'foursquare',
        'email',
        'ml',
        'xmpp',
        'issue_mail',
        'gopher',
        'matrix',
        'mumble',
      ])(hackspace.contact);

      if (!isEmpty(hackspace.contact.keymasters)) {
        result.contact.keymasters = hackspace.contact.keymasters.map(
          pickFields([
            'name',
            'irc_nick',
            'phone',
            'email',
            'twitter',
            'xmpp',
            'mastodon',
            'matrix',
          ]),
        );
      }
    }

    /* */

    const getSensorsRaw = (
      query: UID.ContentType,
      populate = [],
    ): Promise<Object[]> =>
      strapi
        .documents(query)
        .findMany({ populate })
        .then((sensors) =>
          sensors.map((sensor) => ({
            ...sensor,
            lastchange: dateTimeToUnixtime(String(sensor.updatedAt)),
          })),
        );

    const getSensors = (
      query: UID.ContentType,
      fields: Array<string>,
      populate = [],
    ) =>
      getSensorsRaw(query, populate).then((sensors) =>
        sensors.map(pickFields(fields)),
      );

    const sensors = {
      temperature: await getSensors(
        'api::temperature-sensor.temperature-sensor',
        ['value', 'unit', 'location', 'name', 'description', 'lastchange'],
      ),
      carbondioxide: await getSensors(
        'api::carbondioxide-sensor.carbondioxide-sensor',
        ['value', 'unit', 'location', 'name', 'description', 'lastchange'],
      ),
      door_locked: await getSensors(
        'api::door-locked-sensor.door-locked-sensor',
        ['value', 'location', 'name', 'description', 'lastchange'],
      ),
      barometer: await getSensors('api::barometer-sensor.barometer-sensor', [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ]),
      radiation: await (async () => {
        const types = ['alpha', 'beta', 'gamma', 'beta_gamma'];

        const sensors = await getSensorsRaw(
          'api::radiation-sensor.radiation-sensor',
        );

        const draft = Object.fromEntries(
          types.map((type) => [
            type,
            sensors
              .filter((sensor: { type: string }) => sensor.type === type)
              .map(
                pickFields([
                  'value',
                  'unit',
                  'dead_time',
                  'conversion_factor',
                  'location',
                  'name',
                  'description',
                  'lastchange',
                ]),
              ),
          ]),
        );

        return pickFields(types)(draft);
      })(),
      humidity: (
        await getSensors('api::humidity-sensor.humidity-sensor', [
          'value',
          'unit',
          'location',
          'name',
          'description',
          'lastchange',
        ])
      ).map((sensor: { unit: string }) => {
        const { unit, ...rest } = sensor;
        return {
          ...rest,
          unit: unit === 'percents' ? '%' : unit,
        };
      }),
      beverage_supply: await getSensors(
        'api::beverage-supply.beverage-supply',
        ['value', 'unit', 'location', 'name', 'description', 'lastchange'],
      ),
      power_consumption: await getSensors(
        'api::power-consumption-sensor.power-consumption-sensor',
        ['value', 'unit', 'location', 'name', 'description', 'lastchange'],
      ),
      power_generation: await getSensors(
        'api::power-generation-sensor.power-generation-sensor',
        ['value', 'unit', 'location', 'name', 'description', 'lastchange'],
      ),
      wind: (
        await getSensors(
          'api::wind-sensor.wind-sensor',
          ['properties', 'location', 'name', 'description', 'lastchange'],
          [
            'properties.speed',
            'properties.gust',
            'properties.direction',
            'properties.elevation',
          ],
        )
      ).map(
        (sensor: {
          properties: { bits_per_second: number; packets_per_second: number };
        }) => {
          const { properties, ...rest } = sensor;

          const propertiesEntries = Object.entries(
            pickFields(['speed', 'gust', 'direction', 'elevation'])(properties),
          ).map(([k, { value, unit }]) => [
            k,
            {
              value,
              unit: unit === 'degree' ? '°' : unit,
            },
          ]);

          return {
            ...rest,
            ...(isEmpty(propertiesEntries)
              ? {}
              : { properties: Object.fromEntries(propertiesEntries) }),
          };
        },
      ),
      network_connections: (
        await getSensors(
          'api::network-connections-sensor.network-connections-sensor',
          ['location', 'name', 'description', 'lastchange', 'machines'],
          ['machines'],
        )
      ).map((sensor: { machines: Array<{ name?: string; mac?: string }> }) => {
        const { machines, ...rest } = sensor;
        return {
          ...rest,
          ...(isEmpty(machines)
            ? {}
            : { machines: machines.map(pickFields(['name', 'mac'])) }),
        };
      }),
      account_balance: await getSensors(
        'api::account-balance-sensor.account-balance-sensor',
        ['value', 'unit', 'location', 'name', 'description', 'lastchange'],
      ),
      total_member_count: await getSensors(
        'api::total-member-count-sensor.total-member-count-sensor',
        ['value', 'location', 'name', 'description', 'lastchange'],
      ),
      people_now_present: (
        await getSensors(
          'api::people-now-present-sensor.people-now-present-sensor',
          ['value', 'location', 'name', 'names', 'description', 'lastchange'],
          ['names'],
        )
      ).map((sensor: { names: Array<{ name: string }> }) => {
        const { names, ...rest } = sensor;
        return {
          ...rest,
          ...(isEmpty(names) ? {} : { names: names.map((x) => x.name) }),
        };
      }),
      network_traffic: (
        await getSensors(
          'api::network-traffic-sensor.network-traffic-sensor',
          [
            'properties',
            'value',
            'location',
            'name',
            'names',
            'description',
            'lastchange',
          ],
          ['properties.bits_per_second', 'properties.packets_per_second'],
        )
      ).map(
        (sensor: {
          properties: { bits_per_second: number; packets_per_second: number };
        }) => {
          const { properties, ...rest } = sensor;

          const propertiesEntries = Object.entries(
            pickFields(['bits_per_second', 'packets_per_second'])(properties),
          ).map(([k, v]) => [
            k,
            {
              bits_per_second: pickFields(['value', 'maximum']),
              packets_per_second: pickFields(['value']),
            }[k](v),
          ]);

          return {
            ...rest,
            ...(isEmpty(propertiesEntries)
              ? {}
              : { properties: Object.fromEntries(propertiesEntries) }),
          };
        },
      ),
    };

    if (Object.entries(sensors).some(([_, sensor]) => !isEmpty(sensor))) {
      result.sensors = pickFields(Object.keys(sensors))(sensors);
    }

    /* */

    if (!isEmpty(hackspace.feeds)) {
      const feeds = pickFields(['blog', 'wiki', 'calendar', 'flickr'])(
        hackspace.feeds,
      );

      result.feeds = Object.fromEntries(
        Object.entries(feeds).map(([k, v]) => [
          k,
          pickFields(['type', 'url'])(v),
        ]),
      );
    }

    /* */

    if (!isEmpty(hackspace.projects)) {
      result.projects = hackspace.projects.map(({ url }) => url);
    }

    /* */

    if (!isEmpty(hackspace.links)) {
      result.links = hackspace.links.map(
        pickFields(['name', 'description', 'url']),
      );
    }

    /* */

    if (!isEmpty(hackspace.membership_plans)) {
      result.membership_plans = hackspace.membership_plans.map(
        pickFields([
          'name',
          'value',
          'currency',
          'billing_interval',
          'description',
        ]),
      );
    }

    /* */

    if (!isEmpty(hackspace.linked_spaces)) {
      result.linked_spaces = hackspace.linked_spaces.map(
        pickFields(['endpoint', 'website']),
      );
    }

    /* */

    return ctx.send(result);
  },
});
