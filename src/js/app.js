//require('bootstrap-loader');

// Including parent sass file to compile to css
require('../sass/app.scss');

import * as intDefaultsObj from './initiateDefaults';
import * as basketObj from './basketModule';

import $ from 'jquery';
import jQuery from 'jquery';
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

//Initiating intDefaults
window.intDefaults = intDefaultsObj;
//Initiating default function
intDefaults.initiateDefaults();

// Initiating basket function to the window
window.basketFn = basketObj;