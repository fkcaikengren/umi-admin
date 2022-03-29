import { extend } from 'umi-request';
import { notification } from 'antd';
import { getDvaApp } from 'umi';

const codeMessage = {
  200: '服务器成功返回数据',
  400: '发出的请求有错误，服务器没有进行新建或修改操作',
  401: '用户未认证（令牌、用户名、密码错误）',
  403: '用户已认证但无权限，访问是被禁止的',
  422: '当创建一个对象时，发生一个验证错误',
  500: '服务器发生错误，请检查服务器',
};

//本质是一个response拦截器，请求错误时会经过这个拦截器
const errorHandler = async (err) => {
  const { response } = err;
  if (response && response.status) {
    //判断系统层面的错误

    const data = await response.clone().json();
    const { status_code, message, errors } = data;

    if (status_code && message) {
      //处理业务错误
      const key = Object.keys(errors ? errors : {})[0];
      const errMsg = key ? errors[key][0] : message;
      // console.log(errMsg)
      notification.error({
        message: `请求错误${status_code}`,
        description: errMsg,
      });
    } else {
      //如果后端没有给出错误提示
      const { status, url } = response;
      const errorText = codeMessage[status] || response.statusText;
      notification.error({
        message: `请求错误${status}: ${url}`,
        description: errorText,
      });
    }
  } else {
    notification.error({
      message: '你的网络发生异常，无法连接服务器',
      description: '网络异常',
    });
  }
  //方式一：throw Error （更推荐，统一处理完错误继续把错误抛出去）
  throw err;
  //方式二：返回response
  // return response
};

// 这是一个umi-request的实例
const service = extend({
  prefix: 'http://localhost:3000',
  // timeout: 10000,
  errorHandler,
});

// 请求拦截
service.interceptors.request.use((url, options) => {
  // const {accessToken} = getDvaApp()._store.getState().auth
  const accessToken =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLnNob3AuZWR1d29yay5jblwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTYyNjQ5NDMyMCwiZXhwIjoxNjI2ODU0MzIwLCJuYmYiOjE2MjY0OTQzMjAsImp0aSI6IjlmWkpHZmtud3YzcW8zZDMiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.y_PDlgJw1urgA63kcsaSuJKVVr4X91bCptjaekS9cJA';
  if (accessToken) {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          Authorization: accessToken,
        },
      },
    };
  } else {
    return { url, options };
  }
});

// 克隆响应对象做解析处理
service.interceptors.response.use(async (response) => {
  // const {status} = response
  return response; //返回后body会被自动解析
});

export default service;

/*  
  restful风格接口参考
  http://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html


  接口设计：
    1.
    成功的接口（200<=status<300）： 只有业务数据
    失败的接口（status>=300）    ： 包含具体错误信息（可包含自定义的错误码）

    2.发生错误时，不要返回200
      发生错误时不应该返回200，然后把错误信息（包含错误状态码）放入信息体

    

    3.状态码2xx
    200: 请求成功 （get成功）
    201: created  (post成功，put成功都可以使用)，应该返回创建/修改后的实体
    204: no content （delete成功，put成功都可以，如果get查到null），通常不返回实体


    4.请求种类
    get 获取实体
    post 创建实体
    put 整体修改
    patch 局部修改
    delete 删除实体
*/
