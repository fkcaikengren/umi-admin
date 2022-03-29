import React from 'react';
import BaseLayout from './baseLayout';

const whiteList = ['/login', '/article/editor'];
interface IProps {}

const IndexLayout: React.FC<IProps> = (props) => {
  // 根据路由判断Layout
  const { pathname } = props.location;
  if (whiteList.includes(pathname)) {
    return <>{props.children}</>;
  }
  return <BaseLayout {...props}></BaseLayout>;
};

export default IndexLayout;
