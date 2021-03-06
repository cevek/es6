import {v, Component} from './../lib/V';
import {storage} from '../storage';

export class MainFilters extends Component {
    setActive(active) {
        this.props.onChange(active);
    }

    render() {
        return this.root(
            v('div.btn', {
                    onclick: ()=>this.setActive(null),
                    classes: {active: this.props.active == null}
                }, 'All'
            ),
            storage.leagues.data.map((league) =>
                v('div.btn', {
                        key: league.id,
                        onclick: ()=>this.setActive(league),
                        classes: {active: this.props.active === league}
                    }, league.name
                ))
        )
    }
} 