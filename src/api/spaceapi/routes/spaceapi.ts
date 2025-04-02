export default {
  routes: [
    {
      method: 'GET',
      path: '/spaceapi',
      handler: 'spaceapi.index',
      config: {
        auth: false,
      },
    }
  ]
}
