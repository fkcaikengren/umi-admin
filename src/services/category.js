import request from '../utils/request';

export function getCategories() {
  return request.get('/categories');
}

export function addCategory({ name }) {
  return request.post('/categories', {
    data: { name },
  });
}

export function patchCategory({ id, name }) {
  return request.patch(`/categories/${id}`, {
    data: { name },
  });
}

export function deleteCategory({ id }) {
  return request.delete(`/categories/${id}`);
}
