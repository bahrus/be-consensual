import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps {
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
export interface VirtualProps extends EndUserProps, MinimalProxy{}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    onMemberOptions(pp: PP): void;
    evaluateState(pp: PP): void;
    onMatchCountEchoChange(pp: PP): void;
    onSelfProp(pp: PP): void;
    intro(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
}