
import React,{useMemo,useState, useEffect, useCallback, useRef} from 'react'
import { Breadcrumb, Form, Button, Input, Table,Switch, Modal} from 'antd';
import { ExpandAltOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './user.less'
import { getUsers, addUser, updateUser, lockUser} from '../../services/user'

interface QueryValue {
  current: number, 
  name: string, 
  email: string
}


function User() {


  const columns = useMemo(() => [
    {
      title: '头像',
      dataIndex: 'avatar_url',
      key: 'avatar',
      render: source => <img className={styles.avatar} src={source} alt="" />
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '是否禁用',
      dataIndex: 'is_locked',
      key: 'is_locked',
      render:  (num, record) => <Switch checkedChildren="开启" unCheckedChildren="禁用" defaultChecked={num!==0}  onChange={useCallback((checked)=>{
        lockUser(record.id).then(()=>{
          queryUsers()
        }).catch(()=>{
          // do nothing
        })
      }, [lockUser])}/>
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record)=>(
        <Button onClick={useCallback(()=>{
          setEditModalvisible(true)
          setCurRecord({
            id: record.id,
            name: record.name,
            email: record.email
          }
          )
        }, [record,setEditModalvisible])}>编辑</Button>
      )
    }
  ], [])
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({current_page:1, total:0 , per_page:0})
  const [query, setQuery] = useState({current:0, name:'', email:''})
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalvisible, setEditModalvisible] = useState(false)
  const [curRecord, setCurRecord] = useState({
    id: 0,
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)

  const userFormRef = useRef(null)




  useEffect(() => {
    queryUsers()
  }, [])
  useEffect(()=>{
    console.log('set fields')
    userFormRef.current?.setFieldsValue(curRecord)
  },[userFormRef, curRecord])

  useEffect(()=>{
    if(!addModalVisible && !editModalvisible){
      userFormRef.current?.resetFields()
    }
  }, [userFormRef, addModalVisible, editModalvisible])

  const queryUsers = useCallback(
    (newQuery?) => {
      
      let params = (newQuery && newQuery.current)?newQuery:query
      setLoading(true)
      return getUsers(params).then(result=>{
        setLoading(false)
        if(result){
          setUsers(result.data)
          setPagination(result.meta.pagination)
        }
      })
    },
    [query,setLoading],
  )

  const changeQueryName = useCallback(
    (e)=>setQuery({...query,name:e.target.value}),
    [query],
  )
  const changeQueryEmail = useCallback(
    (e)=>setQuery({...query,email:e.target.value}),
    [query],
  )

  const onReset = useCallback(
    () => {
      const newQuery = {current:0, name:'', email:''}
      setQuery(newQuery)
      queryUsers(newQuery)
    },
    [setQuery],
  )

  const onTableChange = useCallback(
    (pagination) => {
      console.log(pagination)
      const {current} = pagination
      // setQuery({...query, current:current-1})
      // console.log(query) /坑： setState是异步的，这里并不能拿到更改后的query
      const newQuery = {...query, current:current}
      setQuery(newQuery)
      console.log(newQuery)
      queryUsers(newQuery)
    },
    [],
  )

  const onCancel = useCallback(()=>{
    console.log(editModalvisible)
    if(addModalVisible){
      setAddModalVisible(false)
    }
    if(editModalvisible){
      setEditModalvisible(false)
    }
    
  },[addModalVisible,editModalvisible,userFormRef])

  const onUserUpdate = useCallback((user)=>{
    if(editModalvisible){
      console.log(user)
      updateUser(user.id, user).then(()=>{
        setEditModalvisible(false)
        queryUsers()
      }).catch(err=>{
        //如果请求出错了
        console.log(err)
      })
    }else{
      addUser(user).then(()=>{
        //如果请求出错了，这个是不会执行的
        //关闭Modal
        setAddModalVisible(false)
        queryUsers()
      }).catch(err=>{
        //如果请求出错了
        console.log(err)
      })
    }
  }, [addModalVisible, editModalvisible])

  return (
    <div>
      <div className='breadcrumb-wrap'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">首页</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            用户管理
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    
      <div className='card'>
        <Form layout="inline" onFinish={queryUsers}>
          <Form.Item label="姓名">
            <Input value={query.name} onChange={changeQueryName}/>
          </Form.Item>
          <Form.Item label="邮箱">
            <Input value={query.email} onChange={changeQueryEmail}/>
          </Form.Item>
          <div className={styles.operator}>
            <Form.Item>
              <Button htmlType="button" onClick={onReset}>重置</Button>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">查询</Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className='card'>
        <div className='row-between pd-bottom-m'>
          <span className='table-titile'>用户列表</span>
          <div className={styles.action_pane}>
            <Button type="primary" icon={<PlusOutlined/> } 
              onClick={useCallback(()=>setAddModalVisible(true),  [])}
            >新建</Button>
            <ExpandAltOutlined className={styles.action_icon}/>
            <SettingOutlined className={styles.action_icon}/>
          </div>
        </div>
        <Table columns={columns} dataSource={users} 
          rowKey={record=>record.id}
          pagination={{ current:pagination.current_page, total:pagination.total, pageSize:pagination.per_page, pageSizeOptions:['10']}}
          onChange={onTableChange}
          loading={loading} 
        />,
      </div>

      {/* user Modal */}
      <Modal title={editModalvisible?'修改用户':'添加用户'} visible={addModalVisible || editModalvisible} footer={null} onCancel={onCancel}>
        <Form layout="vertical" ref={userFormRef} onFinish={onUserUpdate}
        >
          {editModalvisible  &&
            <Form.Item hidden name="id">
              <Input ></Input>
            </Form.Item>
          }
          <Form.Item name="name" label="姓名" rules={[{ required: true, message:'姓名不能为空'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message:'邮箱不能为空' },{type:'email', message:'请提供有效的邮箱'}]}>
            <Input />
          </Form.Item>
          {addModalVisible &&
            <Form.Item name="password" label="密码" rules={[{ required: true, message:'密码不能为空' }]}>
              <Input.Password />
            </Form.Item>
          }
          <Form.Item>
            <Button htmlType='button' onClick={useCallback(()=>{
              editModalvisible 
              ? onCancel()
              : userFormRef.current?.resetFields()
            },[editModalvisible,userFormRef])}>{editModalvisible?'取消':'重置'}</Button>
            <Button htmlType='submit' type='primary' style={{marginLeft:'20px'}}>保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default User

/*
  addModal和editModal复用
    1.add和edit各自管理各自的modal状态
    2.表单回显
      editModal应该回显字段，关于antd表单，
      设置表单的值：formRef.setFieldsValue({name:value}) 
      重置表单： formRef.resetFields()

    3.提交修改
      设置隐藏字段把id隐藏起来，收集包括id在内的数据提交修改后的表单。
*/
