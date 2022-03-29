import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Link } from 'umi';
import {
  Modal,
  Tooltip,
  Button,
  Input,
  Drawer,
  Form,
  Select,
  Image,
  Switch,
  Row,
  Col,
} from 'antd';

import {
  CloseOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import MdEditor from 'components/MdEditor';
import { getCategories } from 'services/category';
import { getTags } from 'services/tag';
import { createArticle } from 'services/article';
import styles from './index.less';
const { Option } = Select;
const { TextArea } = Input;

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

const Editor = () => {
  const [settingVisible, setSettingVisible] = useState(false);
  const [coverSrc, setCoverSrc] = useState('');
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [form] = Form.useForm();
  const [article, setArticle] = useState({});
  const showSetting = () => {
    getCategories().then((data) => {
      const obj = {};
      data.results.forEach((category) => {
        const { id, name } = category;
        obj[id] = name;
      });
      setCategories(obj);
    });
    getTags().then((data) => {
      const obj = {};
      data.results.forEach((tag) => {
        const { id, name } = tag;
        obj[id] = name;
      });
      setTags(obj);
    });
    setSettingVisible(true);
  };
  const onSettingClose = () => {
    Modal.confirm({
      title: '取消文章设置',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将丢弃当前文章设置！',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        form.resetFields();
        setSettingVisible(false);
      },
    });
  };
  const onCoverChange = useCallback(
    (e) => {
      setCoverSrc(form.getFieldValue('cover'));
    },
    [form],
  );
  const onSettingSave = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        setSettingVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const patchArticle = useMemo(
    () => (key) => (value) => {
      let val = value;
      if (value.target) {
        // console.log(value.target.value);
        val = value.target.value;
      }
      setArticle((article) => {
        return {
          ...article,
          [key]: val,
        };
      });
    },
    [],
  );
  const handleEditorChange = useCallback(
    ({ html, text, toc }) => {
      // console.log(html, text);
      console.log('edit change');
      patchArticle('content')(text);
      patchArticle('html')(html);
      patchArticle('toc')(toc);
    },
    [patchArticle],
  );
  const submit = useCallback(
    async (isPublish) => {
      const data = {
        ...article,
        ...form.getFieldsValue(),
        status: isPublish ? 'publish' : 'draft',
      };
      console.log(data);
      const result = await createArticle(data);
      console.log(result);
    },
    [article],
  );
  return (
    <div className="container">
      <header className={styles.header}>
        <div>
          <Tooltip title="退出">
            <Button icon={<CloseOutlined />} />
          </Tooltip>
          <Input
            bordered={false}
            placeholder="输入标题"
            onChange={patchArticle('title')}
          />
        </div>
        <div>
          <Button icon={<SettingOutlined />} onClick={showSetting}>
            设置
          </Button>
          <Button type="primary" onClick={() => submit(true)}>
            发布
          </Button>
          <Button>存为草稿</Button>
          <Button>查看</Button>
          <Button danger>删除</Button>
        </div>
      </header>
      <MdEditor onChange={handleEditorChange} />
      <Drawer
        title="文章设置"
        placement="right"
        width={500}
        onClose={onSettingClose}
        visible={settingVisible}
        footer={
          <div className={styles.setting_footer}>
            <Button size="large" onClick={onSettingClose}>
              取消
            </Button>
            <Button size="large" type="primary" onClick={onSettingSave}>
              确认
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ remember: true }}
          onFinish={onSettingSave}
          autoComplete="off"
        >
          <Form.Item
            name="categoryId"
            label="文章分类"
            rules={[{ required: true }]}
          >
            <Select placeholder="选择分类" allowClear>
              {categories &&
                Object.keys(categories).map((categoryId) => (
                  <Option key={categoryId} value={categoryId}>
                    {categories[categoryId]}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="tagIds"
            label="文章标签"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" placeholder="选择标签" allowClear>
              {tags &&
                Object.keys(tags).map((tagId) => (
                  <Option key={tagId} value={tagId}>
                    {tags[tagId]}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="summary"
            label="文章摘要"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="输入文章摘要"
              autoSize={{ minRows: 5, maxRows: 8 }}
            />
          </Form.Item>
          <Row>
            <Col offset={5} span={19}>
              <Image width={'100%'} height={'auto'} src={coverSrc} />
            </Col>
          </Row>
          <Form.Item name="cover" label="文章封面" rules={[{ required: true }]}>
            <Input
              placeholder="输入图片地址"
              allowClear
              onChange={onCoverChange}
            />
          </Form.Item>
          <Form.Item
            name="isRecommended"
            label="推荐阅读"
            valuePropName="checked"
          >
            <Switch checked={false} />
          </Form.Item>
          {/* <Form.Item name="isAllowComment" label="开启评论" >
          </Form.Item> */}
        </Form>
      </Drawer>
    </div>
  );
};

export default Editor;
