export default {
  routes: [
    {
      method: 'GET',
      path: '/checkhealth',
      handler: 'checkhealth.index',
      config: {
        auth: false,
      },
    },
  ],
};
