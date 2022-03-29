import React, { FC, useEffect } from 'react';
import { Redirect, useSelector } from 'umi';

interface IProps {}
const IndexPage: FC<IProps> = function (props) {
  return <div>hello</div>;
  // const auth = useSelector((state) => state.auth);
  // if (auth.accessToken) {
  //   return <Redirect to="/dashboard" />;
  // }
  // return <Redirect to="/login" />;
};
