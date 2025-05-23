import { name, version } from '../../../../package.json';

export default () => ({
  index() {
    return {
      name,
      version,
      status: 'ok',
    };
  },
});
