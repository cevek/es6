import {Router, Route} from './lib/Router.js';
/*
 import Router from 'react-router';
 let Route = Router.Route;
 */

import {App} from './comp/App';
import {GamePage} from './comp/GamePage';
import {MainForm} from './comp/MainForm';
import {v, Component, render} from './lib/V';


require('./main.css');


/*
 let routes =
 v(Route, {handler: App, path: '/'},
 v(Route, {path: '/', handler: MainForm}),
 v(Route, {path: '/game/:id', handler: GamePage})
 );
 */

let container = document.createElement('div');
document.body.appendChild(container);

render(v(App), container);


/*
 Router.run(routes, function (Handler) {
 React.render(v(Handler), container);
 });*/

