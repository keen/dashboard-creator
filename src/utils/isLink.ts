const isLink = (url: string) => {
  return /(http(s?):)(\/\/[^"']*\.(?:jpg|jpeg|png|gif))/.test(url);
};

export default isLink;
