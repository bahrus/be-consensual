import {BeDecoratedProps} from 'be-decorated/types';

export interface BeConsensualVirtualProps{
    elementSelector?: string,
    onStateSelector?: string,
    offStateSelector?: string,
    prop: string,
    trueVal: any,
    falseVal: any,
    selfProp: string,
    selfIndeterminateProp: string,
    selfTrueVal: any,
    selfFalseVal: any,
    selfIndeterminateVal?: any,
    matchCount?: number,
    matchCountEcho?: number,
    debounceDelay?: number,
    changeEvent?: string,
    downwardFlowInProgress?: boolean,
}

export interface BeConsensualProps extends BeConsensualVirtualProps{
    proxy: Element & BeConsensualVirtualProps;
}

export interface BeConsensualActions{
    onElementSelector(self: this): void;
    evaluateState(self: this): void;
    onMatchCountEchoChange(self: this): void;
    onChangeEvent(self: this): void;
}