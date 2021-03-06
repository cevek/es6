import {v, Component} from './../lib/V';

export class LineUp extends Component {
    render() {
        return this.root(
            v('table.line-up',
                v('thead',
                    v('th.player-name', 'Player'),
                    v('th.right', 'Points')
                ),
                v('tbody',
                    this.props.players.map(player =>
                        v('tr',
                            v('td', player.name),
                            v('td.right', player.points || '-')
                        ))
                )
            )
        );
    }
} 