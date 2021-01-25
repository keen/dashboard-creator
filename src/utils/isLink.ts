const isLink = (url: string) => {
  return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(url);
};

export default isLink;
