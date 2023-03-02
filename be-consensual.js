import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeConsensualController {
    async finale(proxy, target, beDecorProps) {
        const { unsubscribe } = await import('trans-render/lib/subscribe.js');
        unsubscribe(proxy);
    }
    async onMemberOptions(pp) {
        console.log('onMemberOptions');
        const { proxy, self, memberAttr, debounceDelay, memberProp, memberEvent } = pp;
        if (!self.id) {
            self.id = 'a_' + (new Date()).valueOf();
        }
        const id = self.id;
        const { addCSSListener } = await import('trans-render/lib/observeCssSelector.js');
        addCSSListener(id, self, `[${memberAttr}]`, async (e) => {
            if (e.animationName !== id)
                return;
            const target = e.target;
            target.setAttribute(memberAttr.replace('be-', 'is-'), '');
            target.removeAttribute(memberAttr);
            if (memberEvent !== undefined) {
                target.addEventListener(memberEvent, e => {
                    if (proxy.downwardFlowInProgress)
                        return;
                    this.evaluateState(pp);
                });
            }
            else {
                const { subscribe } = await import('trans-render/lib/subscribe.js');
                console.log('subscribe', { target, memberProp });
                subscribe(target, memberProp, () => {
                    console.log('onSubscribe');
                    if (proxy.downwardFlowInProgress)
                        return;
                    this.evaluateState(pp);
                });
            }
            proxy.matchCount++;
            setTimeout(() => {
                proxy.matchCountEcho++;
            }, debounceDelay);
        });
    }
    onMatchCountEchoChange(pp) {
        const { matchCountEcho, matchCount } = pp;
        if (matchCountEcho !== matchCount)
            return;
        this.evaluateState(pp);
    }
    getMemberSelector({ memberAttr }) {
        return '[' + memberAttr.replace('be-', 'is-') + ']';
    }
    async onSelfProp(pp) {
        const { selfProp, self, selfEvent } = pp;
        if (selfEvent !== undefined) {
            self.addEventListener(selfEvent, e => {
                this.passDown(pp);
            });
        }
        else {
            const { subscribe } = await import('trans-render/lib/subscribe.js');
            subscribe(self, selfProp, () => {
                this.passDown(pp);
            });
        }
    }
    passDown(pp) {
        const { selfProp, proxy, memberProp, memberTrueVal, memberFalseVal, selfTrueVal, self, selfEvent } = pp;
        proxy.downwardFlowInProgress = true;
        let val;
        if (proxy[selfProp] === selfTrueVal) {
            val = memberTrueVal;
        }
        else {
            val = memberFalseVal;
        }
        const memberSelector = this.getMemberSelector(pp);
        proxy.getRootNode().querySelectorAll(memberSelector).forEach((el) => {
            el[memberProp] = val;
        });
        proxy.downwardFlowInProgress = false;
    }
    async evaluateState(pp) {
        const { memberAttr, memberProp, memberFalseVal, memberTrueVal, proxy } = pp;
        const memberSelector = this.getMemberSelector(pp);
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
                'memberAttr', 'memberProp', 'memberTrueVal', 'memberFalseVal', 'memberEvent', 'selfEvent',
                'selfProp', 'selfTrueVal', 'selfFalseVal', 'selfIndeterminateProp', 'selfIndeterminateTrueVal', 'selfIndeterminateFalseVal',
                'matchCount', 'matchCountEcho', 'debounceDelay', 'downwardFlowInProgress'
            ],
            proxyPropDefaults: {
                memberProp: 'checked',
                memberEvent: 'input',
                memberTrueVal: true,
                memberFalseVal: false,
                memberAttr: 'be-consensual-member',
                matchCount: 0,
                matchCountEcho: 0,
                selfProp: 'checked',
                selfTrueVal: true,
                selfFalseVal: false,
                selfIndeterminateProp: 'indeterminate',
                selfIndeterminateTrueVal: true,
                selfIndeterminateFalseVal: false,
                selfEvent: 'input',
                downwardFlowInProgress: false,
            },
            finale: 'finale',
        },
        actions: {
            onMemberOptions: {
                ifAllOf: ['memberAttr'],
                ifAtLeastOneOf: ['memberEvent', 'memberProp']
            },
            onMatchCountEchoChange: {
                ifAllOf: ['matchCount', 'matchCountEcho'],
            },
            onSelfProp: {
                ifAllOf: ['selfProp', 'memberProp']
            }
        }
    },
    complexPropDefaults: {
        controller: BeConsensualController
    }
});
register(ifWantsToBe, upgrade, tagName);
