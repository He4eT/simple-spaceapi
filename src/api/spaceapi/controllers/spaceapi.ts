import type { Core } from '@strapi/strapi';
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
    console.log(hackspace)
    console.log(hackspace.location.areas)

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

    /* Sensors */

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

    return ctx.send(result);
  },
});
