import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Row, Tag, Avatar, Breadcrumb } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MENUS from './config';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import styles from '../index.less';

interface IProps {}

const BaseLayout: React.FC<IProps> = (props) => {
  const clickMenu = useCallback((e) => {
    //跳转到用户列表
    props.history.push(e.key);
  }, []);
  return (
    <Layout className="container">
      <Sider width={200}>
        <div className={styles.logo_wrapper}>
          <img
            className={styles.logo}
            src={require('../../assets/images/logo.png')}
            alt="logo"
          />
        </div>
        <Menu mode="inline" defaultSelectedKeys={['2']} theme="dark">
          {MENUS.length > 0 &&
            MENUS.map((menu) =>
              menu.children && menu.children.length > 0 ? (
                <SubMenu key={menu.id} title={menu.name}>
                  {menu.children.map((submenu) => (
                    <Menu.Item key={submenu.path} onClick={clickMenu}>
                      {submenu.name}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={menu.path} onClick={clickMenu}>
                  {menu.name}
                </Menu.Item>
              ),
            )}
        </Menu>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Row justify="end" style={{ height: '100%' }}>
            <div className="logo" />
            <Row align="middle" style={{ height: '100%' }}>
              <SearchOutlined
                style={{ fontSize: '28px', color: '#222', paddingTop: '6px' }}
              />
              <Avatar
                size={40}
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                style={{ marginLeft: '20px' }}
              />
              <span style={{ fontSize: '20px', marginLeft: '6px' }}>
                超级管理员
              </span>
            </Row>
          </Row>
        </Header>
        <Content style={{ overflow: 'auto' }}>{props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>Created By Gavin Tang</Footer>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
