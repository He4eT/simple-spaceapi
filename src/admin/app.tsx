import type { StrapiApp } from '@strapi/strapi/admin';

function applyCustomCSS () {
  const customCSS = `
    * {
      border-radius: 0 !important;
      scrollbar-color: #8e8ea966 transparent;
    }

    ol li a {
      padding-inline-end: 2rem;
    }
  `;

  const customStyle = document.createElement('style');
  customStyle.innerHTML = customCSS;
  document.head.appendChild(customStyle);
}

export default {
  config: {
    tutorials: false,
    notifications: {
      releases: false,
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
    applyCustomCSS();
  },
};
