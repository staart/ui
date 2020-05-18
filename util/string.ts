export const truncate = (str: string, length: number = 50) =>
  str.length > length ? `${str.substring(0, length)}...` : str;
