export const store = {
  setMenuInLocalStorage(menu) {
    const stringifiedMenu = JSON.stringify(menu);
    localStorage.setItem('menu', stringifiedMenu);
  },
  getMenuFromLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
  },
};
