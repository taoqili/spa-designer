import Button from './button'
import Form from './form'

export default {
  title: 'PC通用组件库',
  author: 'CheMingjun',
  icon: '',
  version: '1.0.1',
  comAray: [
    Button,
    Form
  ].map(com => {
    const rtn = Object.assign({rtType: 'react'}, com.json, com)
    delete rtn.json
    return rtn
  })
}