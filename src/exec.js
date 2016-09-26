const exec = (callback, context, sync, customAsyncMethod, args) => {
  const deliver = () => callback.apply(context, args);

  if (sync === true) {
    return deliver();
  }

  return (customAsyncMethod || setTimeout)(deliver, 0);
};

export default exec;
