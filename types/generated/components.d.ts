import type { Schema, Struct } from '@strapi/strapi';

export interface HackspaceContacts extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_contacts';
  info: {
    description: '';
    displayName: 'contacts';
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

export interface HackspaceKeymaster extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_keymasters';
  info: {
    displayName: 'keymaster';
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

export interface HackspaceLocation extends Struct.ComponentSchema {
  collectionName: 'components_hackspace_locations';
  info: {
    description: '';
    displayName: 'location';
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

export interface LocationArea extends Struct.ComponentSchema {
  collectionName: 'components_location_areas';
  info: {
    displayName: 'area';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    square_meters: Schema.Attribute.Decimal & Schema.Attribute.Required;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'hackspace.contacts': HackspaceContacts;
      'hackspace.keymaster': HackspaceKeymaster;
      'hackspace.location': HackspaceLocation;
      'location.area': LocationArea;
      'state.state-icon': StateStateIcon;
    }
  }
}
