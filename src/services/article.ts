import request from '../utils/request'

//type:['all'] , 不传返回非禁用的
export function getArticles({
  page,
  pageSize
}){
  return request.get('/articles',{
    params:{
      page,
      pageSize,
    }
  })
}


export function createArticle(data){
  return request.post('/articles',{data})
}
