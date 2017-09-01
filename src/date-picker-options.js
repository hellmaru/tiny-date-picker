/**
 * @file Responsible for sanitizing and creating date picker options.
 */

import {now, shiftYear, dateOrParse} from './lib/date-manip';

var english = {
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  today: 'Today',
  clear: 'Clear',
  close: 'Close',
};

/**
 * DatePickerOptions constructs a new date picker options object, overriding
 * default values with any values specified in opts.
 *
 * @param {DatePickerOptions} opts
 */
export default function DatePickerOptions(opts) {
  opts = opts || {};
  opts = cp(defaults(cp(english, opts.lang)), opts);

  var parse = dateOrParse(opts.parse);
  opts.parse = parse;
  opts.inRange = makeInRangeFn(opts);
  opts.min = parse(opts.min || shiftYear(now(), -100));
  opts.max = parse(opts.max || shiftYear(now(), 100));

  return opts;
}

function defaults(lang) {
  return {
    // weekStartsMonday defaults to undefined / falsy
    lang: lang,

    // Possible values: dp-modal, dp-below, dp-permanent
    mode: 'dp-modal',

    // The date to hilight initially if the date picker has no
    // initial value.
    preselectedDate: now(),

    format: function (dt) {
      return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
    },

    parse: function (str) {
      var date = new Date(str);
      return isNaN(date) ? now() : date;
    },

    dateClass: function () { },

    inRange: function () {
      return true;
    }
  };
}

function makeInRangeFn(opts) {
  var inRange = opts.inRange; // Cache this version, and return a variant

  return function (dt, dp) {
    return inRange(dt, dp) && opts.min <= dt && opts.max >= dt;
  };
}

function cp(o1, o2) {
  o2 = o2 || {};

  for (var key in o1) {
    var o2Val = o2[key];
    o2Val !== undefined && (o1[key] = o2Val);
  }

  return o1;
}
