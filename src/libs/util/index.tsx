export const generateHashNumber = (str: string) => {
  const arr = str.split('');
  return arr.reduce(
    (hashCode, currentVal) =>
      (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
    0
  );
};

export const generateHashNumberInRange = (str: string, range: number) => {
  const number = generateHashNumber(str);
  return Math.abs(number) % range;
};

export const deduplicateJSONStringList = (JSONStringList: any[]) => {
  return Array.from(
    new Set(
      JSONStringList.map(_ => JSON.stringify(_))
    )
  ).map(_ => JSON.parse(_));
};
