import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeConsensualVirtualProps, BeConsensualActions, BeConsensualProps} from './types';
import {register} from 'be-hive/register.js';
import {addCSSListener} from 'xtal-element/lib/observeCssSelector.js';

export class BeConsensualController implements BeConsensualActions{
    // #target!: Element;
    // intro(proxy: Element & BeConsensualVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
    //     this.#target = target;
    // }
    onElementSelector({proxy, elementSelector, onStateSelector, offStateSelector, debounceDelay}: this): void {
        if(!proxy.id){
            proxy.id = 'a_' + (new Date()).valueOf();
        }
        const id  = proxy.id;
        addCSSListener(id, proxy, `${elementSelector}${onStateSelector}`, (e: AnimationEvent) => {
            if (e.animationName !== id) return;
            proxy.matchCount!++;
            setTimeout(() => {
                if(this.downwardFlowInProgress) return;
                proxy.matchCountEcho!++;
            }, debounceDelay!);
        });
        const id2 = id + '2';
        addCSSListener(id2, proxy, `${elementSelector}${offStateSelector}`, (e: AnimationEvent) => {
            if (e.animationName !== id2) return;
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

    onChangeEvent({proxy, changeEvent, selfTrueVal, selfFalseVal, selfProp, trueVal, falseVal, prop}: this): void {
        proxy.addEventListener(changeEvent!, (e) => {
            console.log({changeEvent, selfTrueVal, selfFalseVal, selfProp, trueVal, falseVal, prop});
            const selfVal = (<any>proxy)[selfProp!];
            const val = selfVal === selfTrueVal ? trueVal : falseVal;
            console.log(val);
            proxy.downwardFlowInProgress = true;
            (proxy.getRootNode() as DocumentFragment).querySelectorAll(proxy.elementSelector!).forEach((el) => {
                console.log({el, val, prop});
                (<any>el)[prop!] = val;
            });
            proxy.downwardFlowInProgress = false;
        });
    }

    evaluateState({elementSelector, onStateSelector, proxy}: this): void {
        const elements = Array.from((proxy.getRootNode() as DocumentFragment).querySelectorAll(elementSelector!));
        let hasTrue = false;
        let hasFalse = false;
        let isIndeterminate = false;
        for(const element of elements){
            if(element.matches(onStateSelector!)){
                hasTrue = true;
            }else{
                hasFalse = true;
            }
            if(hasTrue && hasFalse){
                isIndeterminate = true;
                break;
            }
        }
        if(isIndeterminate){
            (<any>proxy)[proxy.selfIndeterminateProp!] = proxy.selfIndeterminateTrueVal;
        }else if(hasTrue){
            (<any>proxy)[proxy.selfIndeterminateProp!] = proxy.selfIndeterminateFalseVal;
            (<any>proxy)[proxy.selfProp!] = proxy.selfTrueVal;
        }else if(hasFalse){
            (<any>proxy)[proxy.selfIndeterminateProp!] = proxy.selfIndeterminateFalseVal;
            (<any>proxy)[proxy.selfProp!] = proxy.selfFalseVal!;
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
                'elementSelector', 'onStateSelector', 'offStateSelector', 'prop', 'trueVal', 'falseVal', 
                'selfProp', 'selfTrueVal', 'selfFalseVal', 'selfIndeterminateProp', 'selfIndeterminateTrueVal', 'selfIndeterminateFalseVal',
                'matchCount', 'matchCountEcho', 'debounceDelay', 'changeEvent', 'downwardFlowInProgress'
            ],
            proxyPropDefaults:{
                onStateSelector: ':checked',
                offStateSelector: ':not(:checked)',
                matchCount: 0,
                matchCountEcho: 0,
                prop: 'checked',
                trueVal: true,
                falseVal: false,
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
            onElementSelector: 'elementSelector',
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