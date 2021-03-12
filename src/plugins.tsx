import Frame from './topl-view/frame/Frame'

export namespace PlugIns {
  export {NS_Configurable} from "./configurable";
  export {NS_Listenable} from './listenable'

  export namespace Topl {
    export const Frame = Frame
    export {ComContext} from "./topl-view/com/ToplCom";
    export {PinExtInputs} from "./topl-view/config";
  }
}