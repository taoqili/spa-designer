import css from './App.less';

import React, {useCallback, useMemo} from 'react';
import {message} from 'antd';
import Designer from '@mybricks/designer';
import {useComputed, useObservable} from '@mybricks/rxui';

import designerCfg from './config'

import {getLocationSearch} from "./utils";
import {LS_DEFAULT_KEY, LS_VB_PRE} from "./constants";

export default function App() {
  //定义响应式对象，用于保存设计器onload返回的内容
  const loaded = useObservable(class {
    handlers//按钮
    dump//保存时获取当前设计内容的函数
  })

  useMemo(() => {
    //
    Object.assign(designerCfg, {
      keymaps() {
        return {
          get ['ctrl+s']() {
            return () => {
              save(loaded)
            }
          }
        }
      }
    })
  }, [])

  return (
    <div className={css.mainView}>
      <TitleBar loaded={loaded}/>
      <Designer config={designerCfg}
                onLoad={({handlers, dump}) => {
                  loaded.handlers = handlers
                  loaded.dump = dump
                }}
                onMessage={(type, msg) => {
                  message.destroy()
                  message[type](msg)
                }}/>
    </div>
  )
}

function TitleBar({loaded}) {
  const [leftBtns, middleBtns, rightBtns] = useComputed(() => {
    const leftBtns = [], middleBtns = [], rightBtns = []

    if (loaded.handlers) {
      const hary = loaded.handlers
      if (hary) {
        hary.forEach(hd => {
          if (hd.position === 'left') {
            leftBtns.push(jsxHandler(hd))
          } else if (hd.position === 'middle') {
            middleBtns.push(jsxHandler(hd))
          } else if (hd.position === 'right') {
            rightBtns.push(jsxHandler(hd))
          }
        })
      }
    }

    return [leftBtns, middleBtns, rightBtns]
  })

  return (
    <div className={css.titleBar}>
      <div className={css.logo}>
        My<i>Bricks</i> <span>通用0代码解决方案</span>
      </div>
      <div className={css.btnsLeft}>
        {leftBtns}
      </div>
      <div className={css.btnsHandlers}>
        {middleBtns}
      </div>
      <div className={css.btnsRight}>
        {rightBtns}
        <button onClick={() => save(loaded)}>保存</button>
        {/*<button onClick={publish}>发布</button>*/}
      </div>
    </div>
  )
}

function jsxHandler(handler) {
  const icon = handler.icon
  const style = Object.assign({opacity: handler.disabled ? 0.2 : 1}, handler.style || {})
  return (
    <button disabled={handler.disabled} key={handler.id} onClick={handler.exe}
            style={style}>{icon}</button>
  )
}

function save(loaded) {
  const dumpContent = loaded.dump()

  const searchParam = getLocationSearch()
  localStorage.setItem(`${LS_VB_PRE}${searchParam.length ? getLocationSearch() : LS_DEFAULT_KEY}`, JSON.stringify(dumpContent));
  message.info('保存完成.')
}