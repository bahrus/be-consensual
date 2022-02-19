import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeConsensualController {
    #target;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    async finale(proxy, target, beDecorProps) {
        const { unsubscribe } = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
    }
    async onMemberOptions({ proxy, memberAttr, debounceDelay, memberProp }) {
        if (!proxy.id) {
            proxy.id = 'a_' + (new Date()).valueOf();
        }
        const id = proxy.id;
        const { addCSSListener } = await import('xtal-element/lib/observeCssSelector.js');
        addCSSListener(id, proxy, `[${memberAttr}]`, async (e) => {
            if (e.animationName !== id)
                return;
            const target = e.target;
            target.setAttribute(memberAttr.replace('be-', 'is-'), '');
            target.removeAttribute(memberAttr);
            const { subscribe } = await import('trans-render/lib/subscribe.js');
            subscribe(target, memberProp, () => {
                if (proxy.downwardFlowInProgress)
                    return;
                this.evaluateState(this);
            });
            proxy.matchCount++;
            setTimeout(() => {
                proxy.matchCountEcho++;
            }, debounceDelay);
        });
    }
    onMatchCountEchoChange({ matchCountEcho, matchCount }) {
        if (matchCountEcho !== matchCount)
            return;
        this.evaluateState(this);
    }
    get memberSelector() {
        return '[' + this.memberAttr.replace('be-', 'is-') + ']';
    }
    async onSelfProp({ selfProp, proxy, memberProp, memberTrueVal, memberFalseVal, selfTrueVal, memberSelector }) {
        const { subscribe } = await import('trans-render/lib/subscribe.js');
        subscribe(this.#target, selfProp, () => {
            proxy.downwardFlowInProgress = true;
            let val;
            if (proxy[selfProp] === selfTrueVal) {
                val = memberTrueVal;
            }
            else {
                val = memberFalseVal;
            }
            proxy.getRootNode().querySelectorAll(memberSelector).forEach((el) => {
                el[memberProp] = val;
            });
            proxy.downwardFlowInProgress = false;
        });
    }
    async evaluateState({ memberAttr, memberProp, memberFalseVal, memberTrueVal, proxy, memberSelector }) {
        const elements = Array.from(proxy.getRootNode().querySelectorAll(memberSelector));
        let hasTrue = false;
        let hasFalse = false;
        let isIndeterminate = false;
        for (const element of elements) {
            if (element.localName.includes('-'))
                await customElements.whenDefined(element.localName);
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
                'memberAttr', 'memberProp', 'memberTrueVal', 'memberFalseVal',
                'selfProp', 'selfTrueVal', 'selfFalseVal', 'selfIndeterminateProp', 'selfIndeterminateTrueVal', 'selfIndeterminateFalseVal',
                'matchCount', 'matchCountEcho', 'debounceDelay', 'downwardFlowInProgress'
            ],
            proxyPropDefaults: {
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
    complexPropDefaults: {
        controller: BeConsensualController
    }
});
register(ifWantsToBe, upgrade, tagName);
