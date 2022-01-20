import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
import { addCSSListener } from 'xtal-element/lib/observeCssSelector.js';
export class BeConsensualController {
    // #target!: Element;
    // intro(proxy: Element & BeConsensualVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
    //     this.#target = target;
    // }
    onElementSelector({ proxy, memberAttr: elementSelector, onStateSelector, offStateSelector, debounceDelay }) {
        if (!proxy.id) {
            proxy.id = 'a_' + (new Date()).valueOf();
        }
        const id = proxy.id;
        addCSSListener(id, proxy, `${elementSelector}`, (e) => {
            if (e.animationName !== id)
                return;
            const target = e.target;
            target.setAttribute(elementSelector.replace('be-', 'is-'), '');
            target.removeAttribute(elementSelector);
            proxy.matchCount++;
            setTimeout(() => {
                if (this.downwardFlowInProgress)
                    return;
                proxy.matchCountEcho++;
            }, debounceDelay);
        });
    }
    onMatchCountEchoChange({ matchCountEcho, matchCount }) {
        if (matchCountEcho !== matchCount)
            return;
        this.evaluateState(this);
    }
    onChangeEvent({ proxy, changeEvent, selfTrueVal, selfFalseVal, selfProp, memberTrueVal: trueVal, memberFalseVal: falseVal, memberProp: prop }) {
        proxy.addEventListener(changeEvent, (e) => {
            console.log({ changeEvent, selfTrueVal, selfFalseVal, selfProp, trueVal, falseVal, prop });
            const selfVal = proxy[selfProp];
            const val = selfVal === selfTrueVal ? trueVal : falseVal;
            console.log(val);
            proxy.downwardFlowInProgress = true;
            proxy.getRootNode().querySelectorAll(proxy.memberAttr.replace('be-', 'is-')).forEach((el) => {
                console.log({ el, val, prop });
                el[prop] = val;
            });
            proxy.downwardFlowInProgress = false;
        });
    }
    evaluateState({ memberAttr, memberProp, memberFalseVal, memberTrueVal, proxy }) {
        const elements = Array.from(proxy.getRootNode().querySelectorAll('[' + memberAttr.replace('be-', 'is-') + ']'));
        let hasTrue = false;
        let hasFalse = false;
        let isIndeterminate = false;
        for (const element of elements) {
            const aElement = element;
            if (aElement[memberProp] === memberTrueVal) {
                hasTrue = true;
            }
            else if (aElement[memberProp] === memberFalseVal) {
                hasFalse = true;
            }
            else {
                isIndeterminate = true;
                break;
            }
            if (hasTrue && hasFalse) {
                isIndeterminate = true;
                break;
            }
        }
        const aProxy = proxy;
        if (isIndeterminate) {
            aProxy[proxy.selfIndeterminateProp] = proxy.selfIndeterminateTrueVal;
        }
        else if (hasTrue) {
            aProxy[proxy.selfIndeterminateProp] = proxy.selfIndeterminateFalseVal;
            aProxy[proxy.selfProp] = proxy.selfTrueVal;
        }
        else if (hasFalse) {
            aProxy[proxy.selfIndeterminateProp] = proxy.selfIndeterminateFalseVal;
            aProxy[proxy.selfProp] = proxy.selfFalseVal;
        }
    }
}
const tagName = 'be-consensual';
const ifWantsToBe = 'consensual';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            virtualProps: [
                'elementSelector', 'onStateSelector', 'offStateSelector', 'prop', 'trueVal', 'falseVal',
                'selfProp', 'selfTrueVal', 'selfFalseVal', 'selfIndeterminateProp', 'selfIndeterminateTrueVal', 'selfIndeterminateFalseVal',
                'matchCount', 'matchCountEcho', 'debounceDelay', 'changeEvent', 'downwardFlowInProgress'
            ],
            proxyPropDefaults: {
                memberAttr: 'be-consensual-member',
                onStateSelector: ':checked',
                offStateSelector: ':not(:checked)',
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
            onElementSelector: 'elementSelector',
            onMatchCountEchoChange: {
                ifAllOf: ['matchCount', 'matchCountEcho'],
            },
            onChangeEvent: 'changeEvent'
        }
    },
    complexPropDefaults: {
        controller: BeConsensualController
    }
});
register(ifWantsToBe, upgrade, tagName);
