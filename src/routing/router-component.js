import { defineComponent } from '../components/component'
import { hElement, hSlot } from '../h'

export const RouterLink = defineComponent({
    render() {
        const { to } = this.props

        return hElement('a', { 
            href: to, 
            on: { click: (e) => {
                e.preventDefault();
                this.appContext.router.navigateTo(to)
            }
        },
        }, 
        [hSlot()])
    }
})
