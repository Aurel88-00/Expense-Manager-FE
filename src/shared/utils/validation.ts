
export const isValidMongoId = (id: string | undefined | null): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }

  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};


export const assertValidMongoId = (
  id: string | undefined | null,
  fieldName = 'ID'
): asserts id is string => {
  if (!isValidMongoId(id)) {
    throw new Error(`${fieldName} must be a valid MongoDB ObjectId (24-character hex string)`);
  }
};


export const extractMongoId = (value: string | { _id?: string } | undefined | null): string => {
  
  if (!value) {
    return '';
  }
  
  if (typeof value === 'string') {
    const isValid = isValidMongoId(value);
    return isValid ? value : '';
  }
  
  if (typeof value === 'object' && value._id) {
    const isValid = isValidMongoId(value._id);
    return isValid ? value._id : '';
  }
  
  return '';
};

