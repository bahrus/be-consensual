import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeConsensualVirtualProps, BeConsensualActions, BeConsensualProps} from './types';
import {register} from 'be-hive/register.js';
import {addCSSListener} from 'xtal-element/lib/observeCssSelector.js';

export class BeConsensualController implements BeConsensualActions{
    // #target!: Element;
    // intro(proxy: Element & BeConsensualVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
    //     this.#target = target;
    // }
    onMemberAttr({proxy, memberAttr: elementSelector, debounceDelay}: this): void {
        if(!proxy.id){
            proxy.id = 'a_' + (new Date()).valueOf();
        }
        const id  = proxy.id;
        addCSSListener(id, proxy, `${elementSelector}`, (e: AnimationEvent) => {
            if (e.animationName !== id) return;
            const target = e.target as Element;
            target.setAttribute(elementSelector!.replace('be-', 'is-'), '');
            target.removeAttribute(elementSelector!);
            proxy.matchCount!++;
            setTimeout(() => {
                if(this.downwardFlowInProgress) return;
                proxy.matchCountEcho!++;
            }, debounceDelay!);
        });
    }

    onMatchCountEchoChange({matchCountEcho, matchCount}: this): void {
        if(matchCountEcho !== matchCount) return;
        this.evaluateState(this);
    }

    onChangeEvent({proxy, changeEvent, selfTrueVal, selfFalseVal, selfProp, memberTrueVal: trueVal, memberFalseVal: falseVal, memberProp: prop}: this): void {
        proxy.addEventListener(changeEvent!, (e) => {
            console.log({changeEvent, selfTrueVal, selfFalseVal, selfProp, trueVal, falseVal, prop});
            const selfVal = (<any>proxy)[selfProp!];
            const val = selfVal === selfTrueVal ? trueVal : falseVal;
            console.log(val);
            proxy.downwardFlowInProgress = true;
            (proxy.getRootNode() as DocumentFragment).querySelectorAll(proxy.memberAttr!.replace('be-', 'is-')).forEach((el) => {
                console.log({el, val, prop});
                (<any>el)[prop!] = val;
            });
            proxy.downwardFlowInProgress = false;
        });
    }

    evaluateState({memberAttr, memberProp, memberFalseVal, memberTrueVal, proxy}: this): void {
        const elements = Array.from((proxy.getRootNode() as DocumentFragment).querySelectorAll('[' + memberAttr!.replace('be-', 'is-') + ']'));
        let hasTrue = false;
        let hasFalse = false;
        let isIndeterminate = false;
        for(const element of elements){
            const aElement = element as any;
            if(aElement[memberProp!] === memberTrueVal){
                hasTrue = true;
            }else if(aElement[memberProp!] === memberFalseVal){
                hasFalse = true;
            }else{
                isIndeterminate = true;
                break;
            }
            if(hasTrue && hasFalse){
                isIndeterminate = true;
                break;
            }
        }
        const aProxy = proxy as any;
        if(isIndeterminate){
            aProxy[proxy.selfIndeterminateProp!] = proxy.selfIndeterminateTrueVal;
        }else if(hasTrue){
            aProxy[proxy.selfIndeterminateProp!] = proxy.selfIndeterminateFalseVal;
            aProxy[proxy.selfProp!] = proxy.selfTrueVal;
        }else if(hasFalse){
            aProxy[proxy.selfIndeterminateProp!] = proxy.selfIndeterminateFalseVal;
            aProxy[proxy.selfProp!] = proxy.selfFalseVal!;
        }
    }
}

export interface BeConsensualController extends BeConsensualProps{}

const tagName = 'be-consensual';

const ifWantsToBe = 'consensual';

const upgrade = '*';

define<BeConsensualProps & BeDecoratedProps<BeConsensualProps, BeConsensualActions>, BeConsensualActions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            virtualProps: [
                'memberAttr', 'memberProp', 'memberTrueVal', 'memberFalseVal', 
                'selfProp', 'selfTrueVal', 'selfFalseVal', 'selfIndeterminateProp', 'selfIndeterminateTrueVal', 'selfIndeterminateFalseVal',
                'matchCount', 'matchCountEcho', 'debounceDelay', 'changeEvent', 'downwardFlowInProgress'
            ],
            proxyPropDefaults:{
                memberAttr: 'be-consensual-member',
                matchCount: 0,
                matchCountEcho: 0,
                memberProp: 'checked',
                memberTrueVal: true,
                memberFalseVal: false,
                selfProp: 'checked',
                selfTrueVal: true,
                selfFalseVal: false,
                selfIndeterminateProp: 'indeterminate',
                selfIndeterminateTrueVal: true,
                selfIndeterminateFalseVal: false,
                changeEvent: 'input',
                downwardFlowInProgress: false,
            },
        },
        actions: {
            onMemberAttr: 'memberAttr',
            onMatchCountEchoChange: {
                ifAllOf: ['matchCount', 'matchCountEcho'],
            },
            onChangeEvent: 'changeEvent'
        }
    },
    complexPropDefaults:{
        controller: BeConsensualController
    }
});

register(ifWantsToBe, upgrade, tagName);