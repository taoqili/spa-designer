/**
 * XGraph Opensource
 * This source code is licensed under the MIT license.
 * 
 * CheMingjun @2019
 * Mail:chemingjun@126.com Wechat:ALJZJZ
 */

import {clone, Serializable, uuid} from "@mybricks/rxui";
import {SerializeNS} from '../constants';
import {ToplComModel} from "./ToplComModel";
import {PinModel} from "../pin/PinModel";

@Serializable(SerializeNS + 'topl.ToplComModelForked')
export default class ToplComModelForked extends ToplComModel {
  _startInDiagram: boolean

  forkedFrom: ToplComModel

  io: { inputs: { [hostId: string]: boolean }, outputs: { [hostId: string]: boolean } } | 'all-outputs'

  get renderKey() {
    if (!this._key) {
      this._key = uuid()
    }
    return this._key
  }

  isStartInDiagram() {
    return this._startInDiagram
  }

  get frames() {
    return this.forkedFrom.frames
  }

  constructor(parent, forkedFrom, io?: { inputs?: string[], outputs?: string[] } | 'all-outputs') {
    super();
    if (parent) {
      delete this.runtime

      this.parent = parent

      this.forkedFrom = forkedFrom
      if (io === 'all-outputs') {
        this.io = io
      } else if (typeof io === 'object') {
        const ioObj = {
          inputs: {}, outputs: {}
        }

        if (Array.isArray(io.inputs)) {
          io.inputs.forEach(hostId => ioObj.inputs[hostId] = true)
        }else if(typeof io.inputs==='object'){
          ioObj.inputs = io.inputs
        }

        if (Array.isArray(io.outputs)) {
          io.outputs.forEach(hostId => ioObj.outputs[hostId] = true)
        }else if(typeof io.outputs==='object'){
          ioObj.outputs = io.outputs
        }

        this.io = ioObj
      }

      // //if (!io || io !== 'all-outputs') {
      // const showInput = (pin: PinModel) => {
      //   return !io || io.inputs && io.inputs.find(id => id === pin.hostId)
      // }
      //
      // const showOutput = (pin: PinModel) => {
      //   return !io || io === 'all-outputs' || io.outputs && io.outputs.find(id => id === pin.hostId)
      // }
      //
      // if (forkedFrom.inputPins) {
      //   const ins = []
      //   forkedFrom.inputPins.forEach(pin => {
      //     if (showInput(pin)) {
      //       const npin = pin.fork(this)
      //       ins.push(npin)
      //     }
      //   })
      //   this.inputPins = ins
      // }
      //
      // if (forkedFrom.inputPinsInModel) {
      //   const ins = []
      //   forkedFrom.inputPinsInModel.forEach(pin => {
      //     if (showInput(pin)) {
      //       const npin = pin.fork(this)
      //       ins.push(npin)
      //     }
      //   })
      //   this.inputPinsInModel = ins
      // }
      //
      // if (forkedFrom.inputPinExts) {
      //   const ins = []
      //   forkedFrom.inputPinExts.forEach(pin => {
      //     if (showInput(pin)) {
      //       const npin = pin.fork(this)
      //       ins.push(npin)
      //     }
      //   })
      //   this.inputPinExts = ins
      // }
      //
      // if (forkedFrom.outputPins) {
      //   const outs = []
      //   forkedFrom.outputPins.forEach(pin => {
      //     if (showOutput(pin)) {
      //       const npin = pin.fork(this)
      //       outs.push(npin)
      //     }
      //   })
      //   this.outputPins = outs
      // }
      //
      // if (forkedFrom.outputPinsInModel) {
      //   const outs = []
      //   forkedFrom.outputPinsInModel.forEach(pin => {
      //     if (showOutput(pin)) {
      //       const npin = pin.fork(this)
      //       outs.push(npin)
      //     }
      //   })
      //   this.outputPinsInModel = outs
      // }
      //}
    }
  }

  get runtime() {
    return this.forkedFrom.runtime
  }

  // searchPinByHostId(hostId: string) {
  //   return Arrays.find(pin => pin.hostId === hostId, ...this.getInputsAll(), ...this.getOutputsAll())
  // }


  // synchronizeInputPin(pin: PinModel) {
  //   if (!this._inputPins[pin.id]) {
  //     this._inputPins[pin.id] = pin.fork(this)
  //   }
  //   return this._inputPins[pin.id]
  // }
  //
  // synchronizeOutputPin(pin: PinModel) {
  //   if (!this._inputPins[pin.id]) {
  //     this._inputPins[pin.id] = pin.fork(this)
  //   }
  //   return this._inputPins[pin.id]
  // }
  //
  // refreshForkedFromInputs() {
  //   if (this.forkedFrom && !this.isStartInDiagram()) {
  //     const pins = this.inputPinsInModel
  //     const ary: PinModel[] = []
  //     this.forkedFrom.inputPinsInModel.forEach(fpin => {
  //       let pin = pins.find(pin => pin.forkedFrom === fpin)
  //       if (pin) {
  //         ary.push(pin)
  //       } else {
  //         ary.push(fpin.fork(this))
  //       }
  //     })
  //     this.inputPinsInModel = ary
  //   }
  // }

  synchronizeInputs() {
    if (this.forkedFrom) {
      synchronize(this, 'inputPins')
      synchronize(this, 'inputPinsInModel')
      synchronize(this, 'inputPinExts')
    }
  }

  synchronizeOutputs() {
    if (this.forkedFrom) {
      synchronize(this, 'outputPins')
      synchronize(this, 'outputPinsInModel')
      synchronize(this, 'outputPinExts')
    }
  }

  removeOutputPin(hostId: string) {
    super.removeOutputPin(hostId)
    this.forkedFrom.removeOutputPin(hostId)
  }


  toJSON(onlyForked?) {
    const rt = this.runtime

    const json = {} as any

    json.id = this.id
    json._key = this.renderKey

    json.forkedFrom = this.forkedFrom.id

    json.def = rt.def

    json.title = rt.title

    if(!onlyForked){
      json.model = {
        data: clone(rt.model.data),
        // inputAry: clone(rt.model.inputAry),
        // outputAry: clone(rt.model.outputAry),
        script: clone(rt.model.script),
        style: rt.model.style.clone()
      }
    }

    const topl: any = {
      style: clone(this.style)
    }

    if (this.io) {
      topl.io = clone(this.io)
    }

    json.topl = topl

    return json
  }
}

function synchronize(com: ToplComModelForked, type: string) {
  const forked = com[type]
  const forkedFrom = com.forkedFrom[type]

  const io = com.io
  let filter
  if (type.startsWith('input')) {
    if (io === 'all-outputs') {
      filter = false
    } else if (typeof io === 'object') {
      if (io.inputs) {
        filter = io.inputs
      }
    }
  } else {
    if (io === 'all-outputs') {
      filter = true
    } else if (typeof io === 'object') {
      if (io.outputs) {
        filter = io.outputs
      }
    }
  }

  if (filter === false) {
    return
  } else if (typeof filter === 'object') {
    if (Object.keys(filter).length <= 0) {
      return
    } else if (!forkedFrom.find(pin => filter[pin.hostId])) {//Not in filters
      return
    }
  }

  const refreshAll = () => {
    const ary: PinModel[] = []
    forkedFrom.forEach(fpin => {
      if (filter === true || filter[fpin.hostId]) {
        ary.push(fpin.fork(com))
      }
    })
    return ary
  }

  if (filter === true) {
    if (forkedFrom.length !== forked.length) {
      com[type] = refreshAll()
    }
  } else {
    if (forked.length <= 0) {
      com[type] = refreshAll()
    } else {
      const notExist = forked.find((pin, idx) => {
        if (!forkedFrom.find(fpin => pin.forkedFrom === fpin)) {//Not found
          return true
        }
      })
      if (notExist) {
        com[type] = refreshAll()
      }
    }
  }
}