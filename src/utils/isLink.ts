const isLink = (url: string) => {
  return /^(http(s?):)(\/\/[^"']*\.(?:jpg|jpeg|png|gif|webp|svg))$/.test(url);
};

export default isLink;
