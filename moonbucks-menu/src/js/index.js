import { $ } from './utils/dom.js';
import menuApi from './api/index.js';

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';
  this.init = async () => {
    this.menu[this.currentCategory] = await menuApi.getMenusByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = () => {
    const menuList = this.menu[this.currentCategory]
      .map(({ id, isSoldOut, name }) => {
        return `
    <li data-menu-id=${id} class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name ${isSoldOut && 'sold-out'}">${name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
        품절
        </button>
    <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
    수정
    </button>
    <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
    >
    삭제
    </button>
  </li>
    `;
      })
      .join('');

    $('#menu-list').innerHTML = menuList;

    updateMenuCount();
  };

  // 메뉴 카운트 ui를 업데이트하는 메소드
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  // 인풋의 값이 빈 값이 아닐 경우, 메뉴 이름 추가하는 메소드(총개수도 ui도 업데이트)
  const addMenuName = async () => {
    const menuName = $('#menu-name').value;
    if (menuName === '') {
      alert('값을 입력해주시요.');
      return;
    }
    if (this.menu[this.currentCategory].some(({ name }) => name === menuName)) {
      alert('중복되는 이름입니다.');
      $('#menu-name').value = '';
      return;
    }
    await menuApi.createMenu(this.currentCategory, menuName);
    const updatedMenuList = await menuApi.getMenusByCategory(
      this.currentCategory
    );
    this.menu[this.currentCategory] = updatedMenuList;
    render();

    //   메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
    $('#menu-name').value = '';
  };

  // 메뉴 이름을 수정하는 로직
  const updateMenuName = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요', $menuName.innerText);
    if (!updatedMenuName) {
      return;
    }
    await menuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await menuApi.getMenusByCategory(
      this.currentCategory
    );
    render();
  };

  const removeMenuName = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    await menuApi.deleteMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await menuApi.getMenusByCategory(
      this.currentCategory
    );
    render();
  };

  const soldOutMenu = async (e) => {
    const { menuId } = e.target.closest('li').dataset;
    await menuApi.toggleSoldOut(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await menuApi.getMenusByCategory(
      this.currentCategory
    );
    render();
  };

  const changeCategory = async (e) => {
    const isCategoryBtn = e.target.classList.contains('cafe-category-name');
    if (!isCategoryBtn) {
      return;
    }
    const clickedCategoryName = e.target.dataset.categoryName;
    this.currentCategory = clickedCategoryName;

    const categoryWithIcon = e.target.innerText;
    $('#category-name').innerText = `${categoryWithIcon} 메뉴 관리`;
    const categoryWithOutIcon = categoryWithIcon.split(' ')[1];
    $('#menu-name').placeholder = `${categoryWithOutIcon} 메뉴 이름`;
    this.menu[this.currentCategory] = await menuApi.getMenusByCategory(
      this.currentCategory
    );
    render();
  };

  const initEventListeners = () => {
    // 폼 제출 시 새로고침 안 되도록
    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // 이벤트 위임(menu-list-item에 대한 이벤트를 menu-list라는 상위 요소를 이용하여 다룬다.)
    // 수정 및 삭제 버튼 클릭 시의 로직
    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains('menu-remove-button')) {
        if (confirm('정말 삭제하시겠습니까?')) {
          removeMenuName(e);
          updateMenuCount();
          return;
        }
      }

      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
        return;
      }
    });

    // 제출 클릭 시(엔터 시) addMenuName 실행
    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('nav').addEventListener('click', changeCategory);
  };

  //   메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
  //   메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
  //  추가되는 메뉴의 아래 마크업은 <ul id="menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
}

const app = new App();
app.init();
