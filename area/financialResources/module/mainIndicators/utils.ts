import { isEmpty, isEqual, pick } from 'lodash';

export const isContain = (origin: object, tagert: object) => {
  const targetKeys = Object.keys(tagert);
  const pickOrigin = pick(origin, targetKeys);
  if (isEmpty(pickOrigin)) return false;
  return isEqual(pickOrigin, tagert);
};
