import {BeDecoratedProps} from 'be-decorated/types';

export interface BeConsensualVirtualProps{
    memberAttr?: string,
    memberProp?: string,
    memberTrueVal?: any,
    memberFalseVal?: any,
    selfProp?: string,
    selfIndeterminateProp?: string,
    selfTrueVal?: any,
    selfFalseVal?: any,
    selfIndeterminateTrueVal?: any,
    selfIndeterminateFalseVal?: any,
    matchCount?: number,
    matchCountEcho?: number,
    debounceDelay?: number,
    downwardFlowInProgress?: boolean,
}

export interface BeConsensualProps extends BeConsensualVirtualProps{
    proxy: Element & BeConsensualVirtualProps;
}

export interface BeConsensualActions{
    onMemberOptions(self: this): void;
    evaluateState(self: this): void;
    onMatchCountEchoChange(self: this): void;
    onSelfProp(self: this): void;
    intro(proxy: Element & BeConsensualVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
}