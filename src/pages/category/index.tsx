import React, {useMemo, useState, useEffect, useCallback, useRef} from 'react'
import {Link} from 'umi'
import {
  Breadcrumb, Table, Switch, Button, 
  Modal , Form, Input, Select} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {getCategories, addCategory, updateCategory} from '../../services/category'

function Category() {
  const columns = useMemo(() => [
    {title:'名称',  dataIndex: 'name', key: 'name'},
    {title:'层级', dataIndex:'level', key:'level' },
    {title:'状态', dataIndex:'status', key:'status',render: status => <Switch defaultChecked  />},
    {title:'操作', key: 'action', render: (_, record)=>(
      <Button onClick={useCallback(() => {
        setEditModalVisible(true)
        cateFormRef.current?.setFieldsValue({ pid: record.pid===0?'':record.pid })
        cateFormRef.current?.setFieldsValue({ name: record.name })
       },[setEditModalVisible],
      )}>编辑</Button>
    )}
  ], [])

  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [curRecord, setCurRecord] = useState({id:null, pid:0, name:''})
  const cateFormRef = useRef(null)


  useEffect(()=>{
    setLoading(true)
    queryCategories().then(result=>{
      setCategoryList(result)
      setLoading(false)
    })
  }, [getCategories, setLoading])
  useEffect(() => {
    if(!addModalVisible && !editModalVisible){
      //重置表单
      cateFormRef.current?.resetFields()
    }
  }, [addModalVisible, editModalVisible])

  const queryCategories = useCallback(() => {
      return getCategories('all')
    },[getCategories],
  )
  const closeModal = useCallback(() => {
      if(addModalVisible){
        setAddModalVisible(false)
      }else if(editModalVisible){
        setEditModalVisible(false)
      }
    },[addModalVisible, editModalVisible, setAddModalVisible, setEditModalVisible],
  )
  const submit = useCallback(
    (data) => {
      if(addModalVisible){
        if(!data.pid){
          data.pid = 0
        }
        addCategory(data).then(()=>{
          queryCategories() 
          //应该展开其父类
        })
        setAddModalVisible(false)
      }else if(editModalVisible){
        setEditModalVisible(false)
      }
    }, [addModalVisible, editModalVisible],
  )

  return (
    <div className='container'>
      <div className='breadcrumb-wrap'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            分类管理
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      
      <div className='card'>
        <div className='row-between pd-bottom-m'>
          <span className='table-titile'>分类列表</span>
          <Button type="primary" icon={<PlusOutlined/> } 
          onClick={useCallback(()=>setAddModalVisible(true), [setAddModalVisible])}
            >新建</Button>
        </div>
        <Table 
          columns={columns}
          dataSource={categoryList}
          rowKey={record=>record.id}
          loading={loading}
        />
      </div>

      <Modal title='添加分类' visible={addModalVisible || editModalVisible } onCancel={closeModal} footer={null}>
        <Form ref={cateFormRef} labelAlign='right' labelCol={{span:4}} onFinish={submit}>
          <Form.Item label='父级分类' name='pid' >
            <Select >
              {categoryList.length>0 && categoryList.map(cate=>(
                <Select.Option key={cate.id} value={cate.id}>{cate.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='分类名称' name='name' required>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType='button' onClick={closeModal}>取消</Button>
            <Button htmlType='submit' type='primary' style={{marginLeft:'20px'}}>保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Category
