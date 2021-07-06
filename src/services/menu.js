import request from '../utils/request'


export function getMenus(){
  return request.get('/api/admin/menus')
}
