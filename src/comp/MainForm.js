import {MainFilters} from './MainFilters';
import {Loader} from './Loader';
import {GameList} from './GameList';
import {v, Component} from './../lib/V';
import {storage} from '../storage';

export class MainForm extends Component {
    state = {filterDate: null, filterLeague: null};
    days = [];

    changeDate(date) {
        this.setState({filterDate: date});
    }

    leagueFilter() {
        return this.state.filterDate && this.state.filterDate.getTime() ? [this.state.filterDate] : days;
    }

    setLeague(league) {
        this.setState({filterLeague: league});
    }

    dayGames;
    liveGames;

    filterGames() {
        this.dayGames = {};
        this.liveGames = [];
        storage.games.data.forEach(game => {
            if (this.state.filterLeague && game.eventType.league !== this.state.filterLeague) {
                return;
            }
            if (game.isLive()) {
                this.liveGames.push(game);
            }
            else {
                if (this.state.filterDate && this.state.filterDate.getTime() && this.state.filterDate.getDayInt() !== game.date.getDayInt()) {
                    return;
                }
                let dayInt = game.date.getDayInt();
                this.dayGames[dayInt] = this.dayGames[dayInt] || {day: game.date, games: []};
                this.dayGames[dayInt].games.push(game);
            }
        });
    }

    ready = false;

    propsUpdated() {
        this.ready = false;
        storage.ready.then(()=> {
            this.ready = true;
            this.forceUpdate();
        });
    }


    render() {
        if (!this.ready) {
            return this.root(v(Loader));
        }
        this.filterGames();
        return this.root(
            //v('div', this.props.params.id),
            v(MainFilters, {
                active: this.state.filterLeague,
                onChange: (league)=>this.setLeague(league)
            }),

            v('h2', 'Live'),
            v(GameList, {games: this.liveGames}),

            v('h2', 'Scheduled'),
            v('input', {onInput: (e)=>this.changeDate(new Date(e.target.value)), type: 'date'}),

            Object.keys(this.dayGames).map(dayInt => this.dayGames[dayInt].games.length ?
                v('div', {key: dayInt},
                    v('h3', this.dayGames[dayInt].day.toDateString()),
                    v(GameList, {games: this.dayGames[dayInt].games})
                ) : null)
        );
    }
}