export const natsWrapper = {
  client: {
    publish: (_subject: string, _data: string, callback: () => void) => {
      callback();
    },
  },
};
