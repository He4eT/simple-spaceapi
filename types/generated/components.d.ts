import type { Schema, Struct } from '@strapi/strapi';

export interface HackspaceCamera extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_cameras';
  info: {
    description: '';
    displayName: 'Camera';
    icon: 'eye';
  };
  attributes: {
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface HackspaceContacts extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_contacts';
  info: {
    description: '';
    displayName: 'Contacts';
    icon: 'discuss';
  };
  attributes: {
    email: Schema.Attribute.String;
    facebook: Schema.Attribute.String;
    foursquare: Schema.Attribute.String;
    gopher: Schema.Attribute.String;
    identica: Schema.Attribute.String;
    irc: Schema.Attribute.String;
    issue_mail: Schema.Attribute.String;
    keymasters: Schema.Attribute.Component<'hackspace.keymaster', true>;
    mastodon: Schema.Attribute.String;
    matrix: Schema.Attribute.String;
    ml: Schema.Attribute.String;
    mumble: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    sip: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    xmpp: Schema.Attribute.String;
  };
}

export interface HackspaceFeed extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_feeds';
  info: {
    displayName: 'Feed';
    icon: 'cast';
  };
  attributes: {
    type: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HackspaceFeedList extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_feed_lists';
  info: {
    displayName: 'Feed List';
    icon: 'cast';
  };
  attributes: {
    blog: Schema.Attribute.Component<'hackspace.feed', false>;
    calendar: Schema.Attribute.Component<'hackspace.feed', false>;
    flickr: Schema.Attribute.Component<'hackspace.feed', false>;
    wiki: Schema.Attribute.Component<'hackspace.feed', false>;
  };
}

export interface HackspaceKeymaster extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_keymasters';
  info: {
    description: '';
    displayName: 'Keymaster';
    icon: 'user';
  };
  attributes: {
    email: Schema.Attribute.String;
    irc_nick: Schema.Attribute.String;
    mastodon: Schema.Attribute.String;
    matrix: Schema.Attribute.String;
    name: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    xmpp: Schema.Attribute.String;
  };
}

export interface HackspaceLink extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HackspaceLinkedSpace extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_linked_spaces';
  info: {
    displayName: 'Linked Space';
    icon: 'alien';
  };
  attributes: {
    endpoint: Schema.Attribute.String;
    website: Schema.Attribute.String;
  };
}

export interface HackspaceLocation extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_locations';
  info: {
    description: '';
    displayName: 'Location';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.String;
    areas: Schema.Attribute.Component<'location.area', true>;
    country_code: Schema.Attribute.String;
    hint: Schema.Attribute.Text;
    lat: Schema.Attribute.Decimal;
    lon: Schema.Attribute.Decimal;
    timezone: Schema.Attribute.String;
  };
}

export interface HackspaceProject extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_projects';
  info: {
    displayName: 'Project';
    icon: 'apps';
  };
  attributes: {
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HackspaceSpacefed extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_spacefeds';
  info: {
    description: '';
    displayName: 'Spacefed';
    icon: 'globe';
  };
  attributes: {
    spacenet: Schema.Attribute.Boolean & Schema.Attribute.Required;
    spacesaml: Schema.Attribute.Boolean & Schema.Attribute.Required;
  };
}

export interface LocationArea extends Struct.ComponentSchema {
  collectionName: 'components_location_areas';
  info: {
    description: '';
    displayName: 'Area';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    square_meters: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface LocationPerson extends Struct.ComponentSchema {
  collectionName: 'components_location_people';
  info: {
    description: '';
    displayName: 'Person';
    icon: 'emotionHappy';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MembershipPlans extends Struct.ComponentSchema {
  collectionName: 'components_membership_plans';
  info: {
    description: '';
    displayName: 'Plan';
    icon: 'briefcase';
  };
  attributes: {
    billing_interval: Schema.Attribute.Enumeration<
      ['yearly', 'quarterly', 'monthly', 'weekly', 'daily', 'hourly', 'other']
    > &
      Schema.Attribute.Required;
    currency: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface NetworkBitsPerSecond extends Struct.ComponentSchema {
  collectionName: 'components_network_bits_per_seconds';
  info: {
    displayName: 'Bits per Second';
    icon: 'oneToOne';
  };
  attributes: {
    maximum: Schema.Attribute.BigInteger;
    value: Schema.Attribute.BigInteger & Schema.Attribute.Required;
  };
}

export interface NetworkMachine extends Struct.ComponentSchema {
  collectionName: 'components_network_machines';
  info: {
    displayName: 'Machine';
    icon: 'oneToMany';
  };
  attributes: {
    mac: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String;
  };
}

export interface NetworkPacketsPerSecond extends Struct.ComponentSchema {
  collectionName: 'components_network_packets_per_seconds';
  info: {
    displayName: 'Packets per Second';
    icon: 'oneToOne';
  };
  attributes: {
    value: Schema.Attribute.BigInteger & Schema.Attribute.Required;
  };
}

export interface NetworkTrafficProperties extends Struct.ComponentSchema {
  collectionName: 'components_network_traffic_properties';
  info: {
    displayName: 'Traffic Properties';
    icon: 'oneToOne';
  };
  attributes: {
    bits_per_second: Schema.Attribute.Component<
      'network.bits-per-second',
      false
    >;
    packets_per_second: Schema.Attribute.Component<
      'network.packets-per-second',
      false
    >;
  };
}

export interface StateStateIcon extends Struct.ComponentSchema {
  collectionName: 'components_state_state_icons';
  info: {
    description: '';
    displayName: 'State Icons';
    icon: 'lock';
  };
  attributes: {
    closed: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    open: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface WindDirection extends Struct.ComponentSchema {
  collectionName: 'components_wind_directions';
  info: {
    description: '';
    displayName: 'Direction';
    icon: 'feather';
  };
  attributes: {
    unit: Schema.Attribute.Enumeration<['degree']> & Schema.Attribute.Required;
    value: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface WindElevation extends Struct.ComponentSchema {
  collectionName: 'components_wind_elevations';
  info: {
    displayName: 'Elevation';
    icon: 'feather';
  };
  attributes: {
    unit: Schema.Attribute.Enumeration<['m']> & Schema.Attribute.Required;
    value: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface WindProperties extends Struct.ComponentSchema {
  collectionName: 'components_wind_properties';
  info: {
    description: '';
    displayName: 'Properties';
    icon: 'feather';
  };
  attributes: {
    direction: Schema.Attribute.Component<'wind.direction', false> &
      Schema.Attribute.Required;
    elevation: Schema.Attribute.Component<'wind.elevation', false> &
      Schema.Attribute.Required;
    gust: Schema.Attribute.Component<'wind.speed', false> &
      Schema.Attribute.Required;
    speed: Schema.Attribute.Component<'wind.speed', false> &
      Schema.Attribute.Required;
  };
}

export interface WindSpeed extends Struct.ComponentSchema {
  collectionName: 'components_wind_speeds';
  info: {
    displayName: 'Speed';
    icon: 'cursor';
  };
  attributes: {
    unit: Schema.Attribute.Enumeration<['m/s', 'km/h', 'kn']> &
      Schema.Attribute.Required;
    value: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'hackspace.camera': HackspaceCamera;
      'hackspace.contacts': HackspaceContacts;
      'hackspace.feed': HackspaceFeed;
      'hackspace.feed-list': HackspaceFeedList;
      'hackspace.keymaster': HackspaceKeymaster;
      'hackspace.link': HackspaceLink;
      'hackspace.linked-space': HackspaceLinkedSpace;
      'hackspace.location': HackspaceLocation;
      'hackspace.project': HackspaceProject;
      'hackspace.spacefed': HackspaceSpacefed;
      'location.area': LocationArea;
      'location.person': LocationPerson;
      'membership.plans': MembershipPlans;
      'network.bits-per-second': NetworkBitsPerSecond;
      'network.machine': NetworkMachine;
      'network.packets-per-second': NetworkPacketsPerSecond;
      'network.traffic-properties': NetworkTrafficProperties;
      'state.state-icon': StateStateIcon;
      'wind.direction': WindDirection;
      'wind.elevation': WindElevation;
      'wind.properties': WindProperties;
      'wind.speed': WindSpeed;
    }
  }
}
