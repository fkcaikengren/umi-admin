import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Link } from 'umi';
import { Breadcrumb, Table, Switch, Button, Tag, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getArticles } from 'services/article';
import { format } from 'utils/time';
const Article = () => {
  const columns = useMemo(
    () => [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 230,
        fixed: 'left',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status) =>
          status === 'publish' ? (
            <div>
              <Badge status="success" />
              已发布
            </div>
          ) : (
            <div>
              <Badge status="warning" />
              草稿
            </div>
          ),
      },
      {
        title: '分类',
        dataIndex: 'category',
        key: 'category',
        width: 100,
        render: (category) => <Tag color="blue">{category.name}</Tag>,
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        render: (tags) => (
          <div>
            {tags &&
              tags.length > 0 &&
              tags.map((tag, i) => (
                <Tag key={tag.id} color="lime">
                  {tag.name}
                </Tag>
              ))}
          </div>
        ),
      },
      {
        title: '阅读量',
        dataIndex: 'views',
        key: 'views',
        width: 100,
        render: (views) => (
          <Badge count={views} style={{ backgroundColor: '#52c41a' }} />
        ),
      },
      {
        title: '喜欢数',
        dataIndex: 'likes',
        key: 'likes',
        width: 100,
        render: (likes) => (
          <Badge count={likes} style={{ backgroundColor: '#f50' }} />
        ),
      },
      {
        title: '首页推荐',
        dataIndex: 'isRecommended',
        key: 'isRecommended',
        width: 100,
        render: (isRecommended) => <Switch checked={isRecommended}></Switch>,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 200,
        render: (updatedAt) => format(updatedAt),
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        fixed: 'right',
        render: (_, record) => (
          <div>
            <Button type="link" onClick={() => {}}>
              编辑
            </Button>
            <Button type="link" danger onClick={() => {}}>
              删除
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const [articleList, setArticleList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 3,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getArticles({ page: 0, pageSize: 6 }).then((data) => {
      setArticleList(data.results);
      // data.total
      setLoading(false);
    });
  }, [setLoading]);

  return (
    <div className="container">
      <div className="breadcrumb-wrap">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>分类管理</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="card">
        <div className="row-between pd-bottom-m">
          <span className="table-titile">分类列表</span>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => null}>
            新建
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={articleList}
          rowKey={(record) => record.id}
          loading={loading}
          scroll={{ x: 1300 }}
        />
      </div>
    </div>
  );
};

export default Article;
