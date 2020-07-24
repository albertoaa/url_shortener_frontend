const base62 = number => {
  const alphabetArray = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
    ''
  );

  if (number === 0) {
    return alphabetArray[0];
  }

  let hash = [];
  // let i = 0;

  while (number > 0) {
    hash.unshift(alphabetArray[number % 62]);
    number = Math.floor(number / 62);
  }

  return hash.join('');
};

export default base62;
