import request from '../utils/request'


export function getUsers(params){
  return request.get('/api/admin/users',{
    params
  })
}

export function getUserDetail(id){
  return request.get(`/api/admin/users/${id}`)
}

export function lockUser(id){
  return request.get(`/api/admin/users/${id}/lock`)
}


export function addUser(user){
  return request.post('/api/admin/users',{
    data:user
  })
}


export function updateUser(userId,user){
  return request.put('/api/admin/users/'+userId,{
    data:user
  })
}