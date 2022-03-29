import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Link } from 'umi';
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Modal,
  message,
} from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import {
  getCategories,
  addCategory,
  patchCategory,
  deleteCategory,
} from 'services/category';
import { useForm } from 'antd/lib/form/Form';
import style from './index.less';

function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [categoryForm] = useForm();

  useEffect(() => {
    setLoading(true);
    queryCategories();
  }, [getCategories, setLoading]);
  const onSuccess = () => {
    message.success('操作成功');
  };

  const queryCategories = useCallback(
    (useOnSuccess = false) => {
      getCategories('all').then((data) => {
        setCategoryList(data.results);
        setLoading(false);
        if (useOnSuccess) {
          onSuccess();
        }
      });
    },
    [getCategories],
  );

  const saveCategory = useCallback(
    (data) => {
      const { name } = data;
      addCategory({ name }).then(() => {
        categoryForm.resetFields();
        queryCategories(true);
      });
    },
    [setCategoryList],
  );

  const updateCategory = useCallback(
    (data) => {
      patchCategory(data).then(() => {
        categoryForm.resetFields();
        queryCategories(true);
      });
    },
    [patchCategory, categoryForm, queryCategories],
  );

  const removeCategory = useCallback(() => {
    const id = categoryForm.getFieldValue('id');
    Modal.confirm({
      title: '删除分类',
      icon: <WarningOutlined />,
      content: '此操作将永久删除该分类！',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        setLoading(true);
        deleteCategory({ id }).then(() => {
          setUpdating(false);
          categoryForm.resetFields();
          queryCategories(true);
        });
      },
    });
  }, [setUpdating, categoryForm]);

  const submit = useCallback(
    (data) => {
      setLoading(true);
      if (updating) {
        updateCategory(data);
      } else {
        saveCategory(data);
      }
    },
    [updating, saveCategory, updateCategory],
  );

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

      <div className={style.category}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title={updating ? '修改分类' : '添加分类'} bordered={false}>
              <Form onFinish={submit} form={categoryForm}>
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: '请输入分类名称!' }]}
                >
                  <Input placeholder="输入分类名称" />
                </Form.Item>
                <div className={style.form_footer}>
                  <div>
                    <Button type="primary" htmlType="submit">
                      {updating ? '更新' : '保存'}
                    </Button>
                    {updating && (
                      <Button danger onClick={removeCategory}>
                        删除
                      </Button>
                    )}
                  </div>
                  {updating && (
                    <Button
                      type="dashed"
                      onClick={() => {
                        setUpdating(false);
                        categoryForm.resetFields();
                      }}
                    >
                      返回添加
                    </Button>
                  )}
                </div>
              </Form>
            </Card>
          </Col>
          <Col span={16}>
            <Card
              title="分类列表"
              className={style.categoryList}
              bordered={false}
            >
              {categoryList.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => {
                    categoryForm.setFieldsValue({
                      id: category.id,
                      name: category.name,
                    });
                    setUpdating(true);
                  }}
                  style={{ marginRight: 16 }}
                >
                  {category.name}
                </Button>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Category;
