import type { Schema, Struct } from '@strapi/strapi';

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
      'state.state-icon': StateStateIcon;
    }
  }
}
