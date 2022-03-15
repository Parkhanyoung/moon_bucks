const BASE_URL = 'http://localhost:3000/api';

const HTTP_METHOD = {
  POST(data) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: 'DELETE',
    };
  },
};

const request = async (url, option) => {
  const res = await fetch(url, option);
  if (!res.ok) {
    alert('에러가 발생했습니다.');
    console.error(res);
  }
  return res.json();
};

const requestWithoutJson = async (url, option) => {
  const res = await fetch(url, option);
  if (!res.ok) {
    alert('에러가 발생했습니다.');
    console.error(res);
  }
  return res;
};

const menuApi = {
  async createMenu(category, name) {
    return await request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name })
    );
  },

  async getMenusByCategory(category) {
    return await request(`${BASE_URL}/category/${category}/menu`);
  },

  async updateMenu(category, name, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name })
    );
  },

  async toggleSoldOut(category, menuId) {
    return await request(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT()
    );
  },

  async deleteMenu(category, menuId) {
    return await requestWithoutJson(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE()
    );
  },
};

export default menuApi;
