import request from '../utils/request'

//type:['all'] , 不传返回非禁用的
export function getCategories(type){
  return request.get('/api/admin/category',{
    params:{type}
  })
}

export function getCategoryDetail(id){
  return request.get(`/api/admin/category/${id}`)
}


export function addCategory(data){
  return request.post('/api/admin/category',{
    data
  })
}

export function updateCategory(id, data){
  return request.put(`/api/admin/category/${id}`,{
    data
  })
}

export function disableCategory(id){
  return request.patch(`/api/admin/category/${id}/status`)
}
