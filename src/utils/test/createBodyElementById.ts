export const createBodyElementById = (id: string) => {
  let modalRoot = document.getElementById(id);
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', id);
    document.body.appendChild(modalRoot);
  }
};
