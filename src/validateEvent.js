import isString from 'lodash.isstring';

const validateEvent = (event) => {
  if (!isString(event)) {
    throw new Error('Event name must be a string.');
  }
};

export default validateEvent;
