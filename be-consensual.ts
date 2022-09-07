import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {VirtualProps, Actions, Proxy, PP} from './types';
import {register} from 'be-hive/register.js';


export class BeConsensualController implements Actions{
    #target!: Element;
    intro(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps){
        this.#target = target;
    }
    async finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps){
        const {unsubscribe} = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
    }
    async onMemberOptions(pp: PP) {
        const {proxy, memberAttr, debounceDelay, memberProp} = pp;
        if(!proxy.id){
            proxy.id = 'a_' + (new Date()).valueOf();
        }
        const id  = proxy.id;
        const {addCSSListener} = await import('xtal-element/lib/observeCssSelector.js');
        addCSSListener(id, proxy, `[${memberAttr}]`, async (e: AnimationEvent) => {
            if (e.animationName !== id) return;
            const target = e.target as Element;
            target.setAttribute(memberAttr!.replace('be-', 'is-'), '');
            target.removeAttribute(memberAttr!);
            const {subscribe} = await import('trans-render/lib/subscribe.js');
            subscribe(target, memberProp!, () => {
                if(proxy.downwardFlowInProgress) return;
                this.evaluateState(pp);
            });
            proxy.matchCount!++;
            setTimeout(() => {
                
                proxy.matchCountEcho!++;
            }, debounceDelay!);
        });
    }

    onMatchCountEchoChange(pp: PP) {
        const {matchCountEcho, matchCount} = pp;
        if(matchCountEcho !== matchCount) return;
        this.evaluateState(pp);
    }

    getMemberSelector({memberAttr}: PP){
        return '[' + memberAttr!.replace('be-', 'is-') + ']';
    }

    async onSelfProp(pp: PP){
        const {selfProp, proxy, memberProp, memberTrueVal, memberFalseVal, selfTrueVal} = pp;
        const {subscribe} = await import('trans-render/lib/subscribe.js');
        subscribe(this.#target, selfProp!, () => {
            proxy.downwardFlowInProgress = true;
            let val: any;
            if((<any>proxy)[selfProp!] === selfTrueVal){
                val = memberTrueVal;
            }else{
                val = memberFalseVal;
            }
            const memberSelector = this.getMemberSelector(pp);
            (proxy.getRootNode() as DocumentFragment).querySelectorAll(memberSelector).forEach((el) => {
                (<any>el)[memberProp!] = val;
            });
            proxy.downwardFlowInProgress = false;
        })
    }

    async evaluateState(pp: PP): Promise<void> {
        const {memberAttr, memberProp, memberFalseVal, memberTrueVal, proxy} = pp;
        const memberSelector = this.getMemberSelector(pp);
        const elements = Array.from((proxy.getRootNode() as DocumentFragment).querySelectorAll(memberSelector));
        let hasTrue = false;
        let hasFalse = false;
        let isIndeterminate = false;
        for(const element of elements){
            if(element.localName.includes('-')) await customElements.whenDefined(element.localName);
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


const tagName = 'be-consensual';

const ifWantsToBe = 'consensual';

const upgrade = '*';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            virtualProps: [
                'memberAttr', 'memberProp', 'memberTrueVal', 'memberFalseVal', 
                'selfProp', 'selfTrueVal', 'selfFalseVal', 'selfIndeterminateProp', 'selfIndeterminateTrueVal', 'selfIndeterminateFalseVal',
                'matchCount', 'matchCountEcho', 'debounceDelay', 'downwardFlowInProgress'
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
                //changeEvent: 'input',
                downwardFlowInProgress: false,
            },
            
            intro: 'intro',
            finale: 'finale',
        },
        
        actions: {
            onMemberOptions: {
                ifAllOf: ['memberAttr', 'memberProp']
            },
            onMatchCountEchoChange: {
                ifAllOf: ['matchCount', 'matchCountEcho'],
            },
            onSelfProp: {
                ifAllOf: ['selfProp', 'memberProp']
            }
            //onChangeEvent: 'changeEvent'
        }
    },
    complexPropDefaults:{
        controller: BeConsensualController
    }
});

register(ifWantsToBe, upgrade, tagName);