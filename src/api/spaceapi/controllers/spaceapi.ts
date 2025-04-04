import type { Core, UID } from '@strapi/strapi';
import type { Context } from 'koa';

const isEmpty = <A>(x: A): boolean => x == null
  ? true
  : Object.keys(x).length === 0
    ? String(x).length === 0
    : false;

const pickFields = (fields: Array<string>) => (obj: Record<string, unknown>): object =>
  Object.fromEntries(Object.entries(obj)
    .filter(([k, _]) => fields.includes(k))
    .filter(([_, v]) => !isEmpty(v)));

const dateTimeToUnixtime = (updatedAt: string) => {
  const date = new Date(updatedAt);
  return Math.floor(date.getTime() / 1000);
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx: Context) {
    const absoluteURL = (url: string) => url
      ? `${ctx.request.origin}${url}`
      : null;

    const result = {} as Record<string, any>;

    /* */

    const hackspace = await strapi
      .documents('api::hackspace.hackspace')
      .findFirst({ populate: [
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
      ]});

    result.api_compatibility = ['15'];
    result.space = hackspace.space;
    result.logo = absoluteURL(hackspace?.logo.url);
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
        result.location.areas = hackspace.location.areas
          .map(pickFields([
            'name',
            'description',
            'square_meters',
          ]));
      }
    }

    if (!isEmpty(hackspace.spacefed)) {
      result.spacefed = pickFields([
        'spacenet',
        'spacesaml',
      ])(hackspace.spacefed);
    }

    if (!isEmpty(hackspace.cam)) {
      result.cam = hackspace.cam
        .map(({url}) => url);
    }

    /* */

    const state = await strapi
      .documents('api::state.state')
      .findFirst({
        populate: [
          'icon.open',
          'icon.closed',
        ],
      });

    if (!isEmpty(state)) {
      result.state = pickFields([
        'open',
        'trigger_person',
        'message',
      ])(state);

      result.state.lastchange =
        dateTimeToUnixtime(String(state.updatedAt));

      if (!isEmpty(state.icon)) {
        result.state.icon = {
          open: absoluteURL(state.icon?.open.url),
          closed: absoluteURL(state.icon?.closed.url),
        };
      }
    }

    /* */

    const events = await strapi
      .documents('api::event.event')
      .findMany({
        sort: { createdAt: 'desc' },
        limit: 10,
      });

    if (!isEmpty(events)) {
      result.events = events.map((event) => ({
        ...pickFields([
          'name',
          'type',
          'extra',
        ])(event),
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
        result.contact.keymasters = hackspace.contact.keymasters
          .map(pickFields([
            'name',
            'irc_nick',
            'phone',
            'email',
            'twitter',
            'xmpp',
            'mastodon',
            'matrix',
          ]));
      }
    }

    /* */

    const getSensors = (query: UID.ContentType, fields: Array<string>, populate = []) =>
      strapi.documents(query)
      .findMany({ populate })
      .then((sensors) => sensors
        .map((sensor) => ({
          ...sensor,
          lastchange: dateTimeToUnixtime(String(sensor.updatedAt)),
        }))
        .map(pickFields(fields))
      );

    const temperatureSensors = await getSensors(
      'api::temperature-sensor.temperature-sensor',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const carbondioxideSensors = await getSensors(
      'api::carbondioxide-sensor.carbondioxide-sensor',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const doorLockedSensors = await getSensors(
      'api::door-locked-sensor.door-locked-sensor',
      [
        'value',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const barometerSensors = await getSensors(
      'api::barometer-sensor.barometer-sensor',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const radiationSensors = null;

    const humiditySensors = (await getSensors(
      'api::humidity-sensor.humidity-sensor',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    )).map((sensor: {unit: string}) => {
      if (sensor.unit === 'percents') {
        sensor.unit = '%';
      }
      return sensor;
    });

    const beverageSupplySensors = await getSensors(
      'api::beverage-supply.beverage-supply',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const powerConsumptionSensors = await getSensors(
      'api::power-consumption-sensor.power-consumption-sensor',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const powerGenerationSensors = await getSensors(
      'api::power-generation-sensor.power-generation-sensor',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const windSensors = await getSensors(
      'api::wind-sensor.wind-sensor',
      [
        'TODO',
        'properties',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const networkConnectionsSensors = (await getSensors(
      'api::network-connections-sensor.network-connections-sensor',
      [
        'location',
        'name',
        'description',
        'lastchange',
        'machines',
      ],
      [
        'machines',
      ],
    )).map((sensor: {machines: Array<{name?: string, mac?: string}>}) => {
      const { machines, ...rest } = sensor;
      return {
        ...rest,
        ...(isEmpty(machines)
          ? {}
          : { machines: machines.map(pickFields(['name', 'mac'])) }),
      };
    });

    const accountBalanceSensors = await getSensors(
      'api::account-balance-sensor.account-balance-sensor',
      [
        'value',
        'unit',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const totalMemberCountSensors = await getSensors(
      'api::total-member-count-sensor.total-member-count-sensor',
      [
        'value',
        'location',
        'name',
        'description',
        'lastchange',
      ],
    );

    const peopleNowPresentSensors = (await getSensors(
      'api::people-now-present-sensor.people-now-present-sensor',
      [
        'value',
        'location',
        'name',
        'names',
        'description',
        'lastchange',
      ],
      [
        'names',
      ],
    )).map((sensor: { names: Array<any> }) => {
      const { names, ...rest } = sensor;
      return {
        ...rest,
        ...(isEmpty(names)
          ? {}
          : { names: names.map((x) => x.name) }),
      };
    });

    const networkTrafficSensors = (await getSensors(
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
      [
        'properties.bits_per_second',
        'properties.packets_per_second',
      ],
    )).map((sensor: { properties: { bits_per_second: any, packets_per_second: any } }) => {
      const { properties, ...rest } = sensor;

      const cleanProperties = isEmpty(properties)
        ? {}
        : Object.fromEntries(Object.entries(properties)
          .filter(([_, v]) => !isEmpty(v))
          .filter(([k, _]) => [
            'bits_per_second',
            'packets_per_second'
          ].includes(k))
          .map(([key, value]) => [key, {
            'bits_per_second': pickFields(['value', 'maximum']),
            'packets_per_second': pickFields(['value']),
          }[key](value),
          ]));

      return {
        ...rest,
        ...(isEmpty(cleanProperties) ? {} : { properties: cleanProperties }),
      };
    });

    const sensors = {
      temperature: temperatureSensors,
      carbondioxide: carbondioxideSensors,
      door_locked: doorLockedSensors,
      barometer: barometerSensors,
      radiation: radiationSensors,
      humidity: humiditySensors,
      beverage_supply: beverageSupplySensors,
      power_consumption: powerConsumptionSensors,
      power_generation: powerGenerationSensors,
      wind: windSensors,
      network_connections: networkConnectionsSensors,
      account_balance: accountBalanceSensors,
      total_member_count: totalMemberCountSensors,
      people_now_present: peopleNowPresentSensors,
      network_traffic: networkTrafficSensors,
    }


    if (Object.entries(sensors).some(([_, sensor]) => !isEmpty(sensor))) {
      console.log(sensors)
      result.sensors = pickFields(Object.keys(sensors))(sensors)
    }

    /* */

    if (!isEmpty(hackspace.feeds)) {
      const feeds = pickFields([
        'blog',
        'wiki',
        'calendar',
        'flickr',
      ])(hackspace.feeds);

      result.feeds = Object.fromEntries(
        Object.entries(feeds)
          .map(([k, v]) => [k, pickFields([
            'type',
            'url',
          ])(v)])
      );
    }

    /* */

    if (!isEmpty(hackspace.projects)) {
      result.projects = hackspace.projects
        .map(({url}) => url);
    }

    /* */

    if (!isEmpty(hackspace.links)) {
      result.links = hackspace.links
        .map(pickFields([
          'name',
          'description',
          'url',
        ]));
    }

    /* */

    if (!isEmpty(hackspace.membership_plans)) {
      result.membership_plans = hackspace.membership_plans
        .map(pickFields([
          'name',
          'value',
          'currency',
          'billing_interval',
          'description',
        ]));
    }

    /* */

    if (!isEmpty(hackspace.linked_spaces)) {
      result.linked_spaces = hackspace.linked_spaces
        .map(pickFields([
          'endpoint',
          'website',
        ]));
    }

    /* */

    return ctx.send(result);
  },
});
