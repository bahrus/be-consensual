import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
import { addCSSListener } from 'xtal-element/lib/observeCssSelector.js';
export class BeConsensualController {
    // #target!: Element;
    // intro(proxy: Element & BeConsensualVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
    //     this.#target = target;
    // }
    onElementSelector({ proxy, elementSelector, onStateSelector, offStateSelector, debounceDelay }) {
        if (!proxy.id) {
            proxy.id = 'a_' + (new Date()).valueOf();
        }
        const id = proxy.id;
        addCSSListener(id, proxy, `${elementSelector}${onStateSelector}`, (e) => {
            if (e.animationName !== id)
                return;
            proxy.matchCount++;
            setTimeout(() => {
                if (this.downwardFlowInProgress)
                    return;
                proxy.matchCountEcho++;
            }, debounceDelay);
        });
        const id2 = id + '2';
        addCSSListener(id2, proxy, `${elementSelector}${offStateSelector}`, (e) => {
            if (e.animationName !== id2)
                return;
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
    onChangeEvent({ proxy, changeEvent, selfTrueVal, selfFalseVal, selfProp, trueVal, falseVal, prop }) {
        proxy.addEventListener(changeEvent, (e) => {
            const selfVal = proxy[selfProp];
            const val = selfVal === selfTrueVal ? trueVal : falseVal;
            proxy.downwardFlowInProgress = true;
            proxy.getRootNode().querySelectorAll(proxy.elementSelector).forEach((el) => {
                el[prop] = val;
            });
            proxy.downwardFlowInProgress = false;
        });
    }
    evaluateState({ elementSelector, onStateSelector, proxy }) {
        const elements = Array.from(proxy.getRootNode().querySelectorAll(elementSelector));
        let hasTrue = false;
        let hasFalse = false;
        let isIndeterminate = false;
        for (const element of elements) {
            if (element.matches(onStateSelector)) {
                hasTrue = true;
            }
            else {
                hasFalse = true;
            }
            if (hasTrue && hasFalse) {
                isIndeterminate = true;
                break;
            }
        }
        if (isIndeterminate) {
            proxy[proxy.selfIndeterminateProp] = proxy.selfIndeterminateTrueVal;
        }
        else if (hasTrue) {
            proxy[proxy.selfIndeterminateProp] = proxy.selfIndeterminateFalseVal;
            proxy[proxy.selfProp] = proxy.selfTrueVal;
        }
        else if (hasFalse) {
            proxy[proxy.selfIndeterminateProp] = proxy.selfIndeterminateFalseVal;
            proxy[proxy.selfProp] = proxy.selfFalseVal;
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
    complexPropDefaults: {
        controller: BeConsensualController
    }
});
register(ifWantsToBe, upgrade, tagName);
