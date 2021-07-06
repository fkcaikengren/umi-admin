import React, {useCallback} from 'react'
import {Form, Input, Button} from 'antd'
import {Redirect, useDispatch, useSelector} from 'umi'
import styles from './login.less'

/*函数式组件中，useDispatch和useSelector替代connect*/
function Login() {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const onFinish = useCallback(
        
        (values: any) => {
            console.log(values)
            dispatch({type:'auth/login', payload:values})
        }, []
    )
    if(auth.accessToken){
        return <Redirect to="/" />
    }
    return (
        <div className={styles.container}>
            <div className={styles.login_wrapper}>
                <div className={styles.header}>Login</div>
                <Form name="basic" layout="vertical" onFinish={onFinish}>
                    <Form.Item 
                        label="email"
                        name="email"
                        rules={[{required:true, message:'Please input your email!'},{type:'email', message: 'Please provide a valid email!'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                     <div className={styles.center_row}>
                        <Button type="primary" className="button-color-pink" htmlType="submit">
                        Submit
                        </Button>
                     </div>
                </Form>
                <div className={styles.msg}>
                    Don't have account? <a href="">Singn up</a>
                </div>
            </div>
        </div>
    )
}

export default Login
