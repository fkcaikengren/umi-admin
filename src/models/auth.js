import request from '../utils/request'

export default{
  namespace: 'auth',
  state: {
    accessToken:null
  },
  effects:{
    *login({payload},{call, put}){
      const data = yield call(request,'/api/auth/login', {
        method: 'post',
        data: payload
      })
      yield put({type:'handleLogin', payload:data})
    }
  },
  reducers:{
    handleLogin(state,action){
      console.log('handle login')
      const {access_token,expires_in, token_type} = action.payload
      return {...state,accessToken:`${token_type} ${access_token}`}
    }
  }

}