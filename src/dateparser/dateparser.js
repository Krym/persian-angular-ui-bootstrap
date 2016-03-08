angular.module('ui.bootstrap.dateparser', [])
    .constant('locale_fa', {
        DATETIME_FORMATS: {
            "AMPMS": [
                "&#x635;&#x628;&#x62D;",
                "&#x639;&#x635;&#x631;"
            ],
            "DAY": [
                "\u06cc\u06a9\u0634\u0646\u0628\u0647",
                "\u062f\u0648\u0634\u0646\u0628\u0647",
                "\u0633\u0647\u200c\u0634\u0646\u0628\u0647",
                "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
                "\u067e\u0646\u062c\u0634\u0646\u0628\u0647",
                "\u062c\u0645\u0639\u0647",
                "\u0634\u0646\u0628\u0647"
            ],
            "ERANAMES": [
                "پیش از هجرت",
                "هجری شمسی"
            ],
            "ERAS": [
                "پ. هجرت",
                " شمسی"
            ],
            "FIRSTDAYOFWEEK": 5,
            "MONTH": [
                "فروردین",
                "اردیبهشت",
                "خرداد",
                "تیر",
                "مرداد",
                "شهریور",
                "مهر",
                "آبان",
                "آذر",
                "دی",
                "بهمن",
                "اسفند"
            ],
            "SHORTDAY": [
                "\u06cc",
                "\u062f",
                "\u0633",
                "\u0686",
                "\u067e",
                "\u062c",
                "\u0634"
            ],
            "SHORTMONTH": [
                "فروردین",
                "اردیبهشت",
                "خرداد",
                "تیر",
                "مرداد",
                "شهریور",
                "مهر",
                "آبان",
                "آذر",
                "دی",
                "بهمن",
                "اسفند"
            ],
            "STANDALONEMONTH": [
                "فروردین",
                "اردیبهشت",
                "خرداد",
                "تیر",
                "مرداد",
                "شهریور",
                "مهر",
                "آبان",
                "آذر",
                "دی",
                "بهمن",
                "اسفند"
            ],
            "WEEKENDRANGE": [
                4,
                4
            ],
            "fullDate": "EEEE d MMMM y",
            "longDate": "d MMMM y",
            "medium": "d MMM y H:mm:ss",
            "mediumDate": "d MMM y",
            "mediumTime": "H:mm:ss",
            "short": "y/M/d H:mm",
            "shortDate": "y/M/d",
            "shortTime": "H:mm"
        }
    })
    .constant('uibJalaliDate', {
        g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
    })
    .service('jDateFilter', ['$log', 'locale_fa', 'dateFilter', 'uibJalaliDate', function ($log, $locale, dateFilter, JalaliDate) {
        function jalaaliProtypes() {

            JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
                j_y = parseInt(j_y, 10);
                j_m = parseInt(j_m, 10);
                j_d = parseInt(j_d, 10);
                var jy = j_y - 979;
                var jm = j_m - 1;
                var jd = j_d - 1;

                var j_day_no = 365 * jy + parseInt(jy / 33, 10) * 8 + parseInt((jy % 33 + 3) / 4, 10);
                var i;
                for (i = 0; i < jm; ++i) {
                    j_day_no += JalaliDate.j_days_in_month[i];
                }

                j_day_no += jd;

                var g_day_no = j_day_no + 79;

                var gy = 1600 + 400 * parseInt(g_day_no / 146097, 10);
                /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
                g_day_no = g_day_no % 146097;

                var leap = true;
                if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
                {
                    g_day_no--;
                    gy += 100 * parseInt(g_day_no / 36524, 10);
                    /* 36524 = 365*100 + 100/4 - 100/100 */
                    g_day_no = g_day_no % 36524;

                    if (g_day_no >= 365) {
                        g_day_no++;
                    }
                    else {
                        leap = false;
                    }
                }

                gy += 4 * parseInt(g_day_no / 1461, 10);
                /* 1461 = 365*4 + 4/4 */
                g_day_no %= 1461;

                if (g_day_no >= 366) {
                    leap = false;

                    g_day_no--;
                    gy += parseInt(g_day_no / 365, 10);
                    g_day_no = g_day_no % 365;
                }

                for (i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i === 1 && leap); i++) {
                    g_day_no -= JalaliDate.g_days_in_month[i] + (i === 1 && leap);
                }
                var gm = i + 1;
                var gd = g_day_no + 1;

                return [gy, gm, gd];
            };

            JalaliDate.checkDate = function (j_y, j_m, j_d) {
                return !(j_y < 0 || j_y > 32767 || j_m < 1 || j_m > 12 || j_d < 1 || j_d >
                JalaliDate.j_days_in_month[j_m - 1] + (j_m === 12 && !((j_y - 979) % 33 % 4)));
            };

            JalaliDate.gregorianToJalali = function (g_y, g_m, g_d) {
                g_y = parseInt(g_y, 10);
                g_m = parseInt(g_m, 10);
                g_d = parseInt(g_d, 10);
                var gy = g_y - 1600;
                var gm = g_m - 1;
                var gd = g_d - 1;

                var g_day_no = 365 * gy + parseInt((gy + 3) / 4, 10) - parseInt((gy + 99) / 100, 10) + parseInt((gy + 399) / 400, 10);
                var i;
                for (i = 0; i < gm; ++i) {
                    g_day_no += JalaliDate.g_days_in_month[i];
                }
                if (gm > 1 && (gy % 4 === 0 && gy % 100 !== 0 || gy % 400 === 0)) {
                    /* leap and after Feb */
                    ++g_day_no;
                }
                g_day_no += gd;

                var j_day_no = g_day_no - 79;

                var j_np = parseInt(j_day_no / 12053, 10);
                j_day_no %= 12053;

                var jy = 979 + 33 * j_np + 4 * parseInt(j_day_no / 1461, 10);

                j_day_no %= 1461;

                if (j_day_no >= 366) {
                    jy += parseInt((j_day_no - 1) / 365, 10);
                    j_day_no = (j_day_no - 1) % 365;
                }

                for (i = 0; i < 11 && j_day_no >= JalaliDate.j_days_in_month[i]; ++i) {
                    j_day_no -= JalaliDate.j_days_in_month[i];
                }
                var jm = i + 1;
                var jd = j_day_no + 1;


                return [jy, jm, jd];
            };

            Date.prototype.setJalaliFullYear = function (y, m, d) {
                var gd = this.getDate();
                var gm = this.getMonth();
                var gy = this.getFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                if (y < 100) {
                    y += 1300;
                }
                j[0] = y;
                if (m !== undefined) {
                    if (m > 11) {
                        j[0] += Math.floor(m / 12);
                        m = m % 12;
                    }
                    j[1] = m + 1;
                }
                if (d !== undefined) {
                    j[2] = d;
                }
                var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
                return this.setFullYear(g[0], g[1] - 1, g[2]);
            };

            Date.prototype.setJalaliMonth = function (m, d) {
                var gd = this.getDate();
                var gm = this.getMonth();
                var gy = this.getFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                if (m > 11) {
                    j[0] += Math.floor(m / 12);
                    m = m % 12;
                }
                j[1] = m + 1;
                if (d !== undefined) {
                    j[2] = d;
                }
                var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
                return this.setFullYear(g[0], g[1] - 1, g[2]);
            };

            Date.prototype.setJalaliDate = function (d) {
                var gd = this.getDate();
                var gm = this.getMonth();
                var gy = this.getFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                j[2] = d;
                var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
                return this.setFullYear(g[0], g[1] - 1, g[2]);
            };

            Date.prototype.getJalaliFullYear = function () {
                var gd = this.getDate();
                var gm = this.getMonth();
                var gy = this.getFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                return j[0];
            };

            Date.prototype.getJalaliMonth = function () {
                var gd = this.getDate();
                var gm = this.getMonth();
                var gy = this.getFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                return j[1] - 1;
            };

            Date.prototype.getJalaliDate = function () {
                var gd = this.getDate();
                var gm = this.getMonth();
                var gy = this.getFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                return j[2];
            };

            Date.prototype.getJalaliDay = function () {
                var day = this.getDay();
                day = (day + 1) % 7;
                return day;
            };


            /**
             * Jalali UTC functions
             */

            Date.prototype.setJalaliUTCFullYear = function (y, m, d) {
                var gd = this.getUTCDate();
                var gm = this.getUTCMonth();
                var gy = this.getUTCFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                if (y < 100) {
                    y += 1300;
                }
                j[0] = y;
                if (m !== undefined) {
                    if (m > 11) {
                        j[0] += Math.floor(m / 12);
                        m = m % 12;
                    }
                    j[1] = m + 1;
                }
                if (d !== undefined) {
                    j[2] = d;
                }
                var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
                return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
            };

            Date.prototype.setJalaliUTCMonth = function (m, d) {
                var gd = this.getUTCDate();
                var gm = this.getUTCMonth();
                var gy = this.getUTCFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                if (m > 11) {
                    j[0] += Math.floor(m / 12);
                    m = m % 12;
                }
                j[1] = m + 1;
                if (d !== undefined) {
                    j[2] = d;
                }
                var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
                return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
            };

            Date.prototype.setJalaliUTCDate = function (d) {
                var gd = this.getUTCDate();
                var gm = this.getUTCMonth();
                var gy = this.getUTCFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                j[2] = d;
                var g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
                return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
            };

            Date.prototype.getJalaliUTCFullYear = function () {
                var gd = this.getUTCDate();
                var gm = this.getUTCMonth();
                var gy = this.getUTCFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                return j[0];
            };

            Date.prototype.getJalaliUTCMonth = function () {
                var gd = this.getUTCDate();
                var gm = this.getUTCMonth();
                var gy = this.getUTCFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                return j[1] - 1;
            };

            Date.prototype.getJalaliUTCDate = function () {
                var gd = this.getUTCDate();
                var gm = this.getUTCMonth();
                var gy = this.getUTCFullYear();
                var j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
                return j[2];
            };

            Date.prototype.getJalaliUTCDay = function () {
                var day = this.getUTCDay();
                day = (day + 1) % 7;
                return day;
            };
        }

        jalaaliProtypes();
        var ZERO_CHAR = '0';
        var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
            NUMBER_STRING = /^\-?\d+$/;

        var uppercase = function (string) {
            return isString(string) ? string.toUpperCase() : string;
        };

        function padNumber(num, digits, trim) {
            var neg = '';
            if (num < 0) {
                neg = '-';
                num = -num;
            }
            num = '' + num;
            while (num.length < digits) {
                num = ZERO_CHAR + num;
            }
            if (trim) {
                num = num.substr(num.length - digits);
            }
            return neg + num;
        }

        function concat(array1, array2, index) {
            return array1.concat([].slice.call(array2, index));
        }

        function isNumber(value) {
            return typeof value === 'number';
        }

        function isDate(value) {
            return Object.prototype.toString.call(value) === '[object Date]';
        }

        function isString(value) {
            return typeof value === 'string';
        }

        function dateGetter(name, size, offset, trim) {
            offset = offset || 0;
            return function (date) {
                var value = date['get' + name]();
                if (offset > 0 || value > -offset) {
                    value += offset;
                }
                if (value === 0 && offset === -12) {
                    value = 12;
                }
                return padNumber(value, size, trim);
            };
        }

        function dateStrGetter(name, shortForm) {
            return function (date, formats) {
                var value = date['get' + name]();
                var pname = name.indexOf('Jalali') > -1 ? name.substr(6) : name;
                var get = uppercase(shortForm ? 'SHORT' + pname : pname);

                return formats[get][value];
            };
        }

        function ampmGetter(date, formats) {
            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
        }

        function eraGetter(date, formats) {
            return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
        }

        function longEraGetter(date, formats) {
            return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
        }

        function getThursdayThisWeek(datetime) {
            return new Date(datetime.getFullYear(), datetime.getMonth(),
                // 4 = index of Thursday
                datetime.getDate() + (4 - datetime.getDay()));
        }

        function weekGetter(size) {
            return function (date) {
                var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
                    thisThurs = getThursdayThisWeek(date);

                var diff = +thisThurs - +firstThurs,
                    result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week

                return padNumber(result, size);
            };
        }

        function timeZoneGetter(date, formats, offset) {
            var zone = -1 * offset;
            var paddedZone = zone >= 0 ? "+" : "";

            paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
                padNumber(Math.abs(zone % 60), 2);

            return paddedZone;
        }

        function getFirstThursdayOfYear(year) {
            // 0 = index of January
            var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
            // 4 = index of Thursday (+1 to account for 1st = 5)
            // 11 = index of *next* Thursday (+1 account for 1st = 12)
            return new Date(year, 0, (dayOfWeekOnFirst <= 4 ? 5 : 12) - dayOfWeekOnFirst);
        }

        var DATE_FORMATS = {
            yyyy: dateGetter('JalaliFullYear', 4),
            yy: dateGetter('JalaliFullYear', 2, 0, true),
            y: dateGetter('JalaliFullYear', 1),
            MMMM: dateStrGetter('JalaliMonth'),
            MMM: dateStrGetter('JalaliMonth', true),
            MM: dateGetter('JalaliMonth', 2, 1),
            M: dateGetter('JalaliMonth', 1, 1),
            dd: dateGetter('JalaliDate', 2),
            d: dateGetter('JalaliDate', 1),
            HH: dateGetter('Hours', 2),
            H: dateGetter('Hours', 1),
            hh: dateGetter('Hours', 2, -12),
            h: dateGetter('Hours', 1, -12),
            mm: dateGetter('Minutes', 2),
            m: dateGetter('Minutes', 1),
            ss: dateGetter('Seconds', 2),
            s: dateGetter('Seconds', 1),
            // while ISO 8601 requires fractions to be prefixed with `.` or `,`
            // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
            sss: dateGetter('Milliseconds', 3),
            EEEE: dateStrGetter('Day'),
            EEE: dateStrGetter('Day', true),
            a: ampmGetter,
            Z: timeZoneGetter,
            ww: weekGetter(2),
            w: weekGetter(1),
            G: eraGetter,
            GG: eraGetter,
            GGG: eraGetter,
            GGGG: longEraGetter
        };
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        // 1        2       3         4          5          6          7          8  9     10      11
        function jsonStringToDate(string) {
            var match = string.match(R_ISO8601_STR);
            if (match) {
                var date = new Date(0),
                    tzHour = 0,
                    tzMin = 0,
                    dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                    timeSetter = match[8] ? date.setUTCHours : date.setHours;

                if (match[9]) {
                    tzHour = toInt(match[9] + match[10]);
                    tzMin = toInt(match[9] + match[11]);
                }
                dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
                var h = toInt(match[4] || 0) - tzHour;
                var m = toInt(match[5] || 0) - tzMin;
                var s = toInt(match[6] || 0);
                var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
                timeSetter.call(date, h, m, s, ms);
                return date;
            }
            return string;
        }


        return function (date, format, timezone) {
            var text = '',
                parts = [],
                fn, match;

            format = format || 'mediumDate';
            format = $locale.DATETIME_FORMATS[format] || format;
            if (isString(date)) {
                date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
            }

            if (isNumber(date)) {
                date = new Date(date);
            }

            if (!isDate(date) || !isFinite(date.getTime())) {
                return date;
            }

            while (format) {
                match = DATE_FORMATS_SPLIT.exec(format);
                if (match) {
                    parts = concat(parts, match, 1);
                    format = parts.pop();
                } else {
                    parts.push(format);
                    format = null;
                }
            }

            var dateTimezoneOffset = date.getTimezoneOffset();
            if (timezone) {
                dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
                date = convertTimezoneToLocal(date, timezone, true);
            }
            angular.forEach(parts, function (value) {
                fn = DATE_FORMATS[value];
                text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset)
                    : value === "''" ? "'" : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
            });

            return text;
        };

    }])
    .service('uibDateParser', ['$log', '$locale', 'locale_fa', 'dateFilter', 'orderByFilter', 'jDateFilter',
        function ($log, $locale, $locale_fa, dateFilter, orderByFilter, jDateFilter) {
            // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
            var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

            var localeId;
            var formatCodeToRegex, jFormatCodeToRegex;

            this.init = function () {
                localeId = $locale.id;

                this.parsers = {};
                this.formatters = {};

                formatCodeToRegex = [
                    {
                        key: 'yyyy',
                        regex: '\\d{4}',
                        apply: function (value) {
                            this.year = +value;
                        },
                        formatter: function (date) {
                            var _date = new Date();
                            _date.setFullYear(Math.abs(date.getFullYear()));
                            return dateFilter(_date, 'yyyy');
                        }
                    },
                    {
                        key: 'yy',
                        regex: '\\d{2}',
                        apply: function (value) {
                            this.year = +value + 2000;
                        },
                        formatter: function (date) {
                            var _date = new Date();
                            _date.setFullYear(Math.abs(date.getFullYear()));
                            return dateFilter(_date, 'yy');
                        }
                    },
                    {
                        key: 'y',
                        regex: '\\d{1,4}',
                        apply: function (value) {
                            this.year = +value;
                        },
                        formatter: function (date) {
                            var _date = new Date();
                            _date.setFullYear(Math.abs(date.getFullYear()));
                            return dateFilter(_date, 'y');
                        }
                    },
                    {
                        key: 'M!',
                        regex: '0?[1-9]|1[0-2]',
                        apply: function (value) {
                            this.month = value - 1;
                        },
                        formatter: function (date) {
                            var value = date.getMonth();
                            if (/^[0-9]$/.test(value)) {
                                return dateFilter(date, 'MM');
                            }

                            return dateFilter(date, 'M');
                        }
                    },
                    {
                        key: 'MMMM',
                        regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
                        apply: function (value) {
                            this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value);
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'MMMM');
                        }
                    },
                    {
                        key: 'MMM',
                        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
                        apply: function (value) {
                            this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value);
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'MMM');
                        }
                    },
                    {
                        key: 'MM',
                        regex: '0[1-9]|1[0-2]',
                        apply: function (value) {
                            this.month = value - 1;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'MM');
                        }
                    },
                    {
                        key: 'M',
                        regex: '[1-9]|1[0-2]',
                        apply: function (value) {
                            this.month = value - 1;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'M');
                        }
                    },
                    {
                        key: 'd!',
                        regex: '[0-2]?[0-9]{1}|3[0-1]{1}',
                        apply: function (value) {
                            this.date = +value;
                        },
                        formatter: function (date) {
                            var value = date.getDate();
                            if (/^[1-9]$/.test(value)) {
                                return dateFilter(date, 'dd');
                            }

                            return dateFilter(date, 'd');
                        }
                    },
                    {
                        key: 'dd',
                        regex: '[0-2][0-9]{1}|3[0-1]{1}',
                        apply: function (value) {
                            this.date = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'dd');
                        }
                    },
                    {
                        key: 'd',
                        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
                        apply: function (value) {
                            this.date = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'd');
                        }
                    },
                    {
                        key: 'EEEE',
                        regex: $locale.DATETIME_FORMATS.DAY.join('|'),
                        formatter: function (date) {
                            return dateFilter(date, 'EEEE');
                        }
                    },
                    {
                        key: 'EEE',
                        regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
                        formatter: function (date) {
                            return dateFilter(date, 'EEE');
                        }
                    },
                    {
                        key: 'HH',
                        regex: '(?:0|1)[0-9]|2[0-3]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'HH');
                        }
                    },
                    {
                        key: 'hh',
                        regex: '0[0-9]|1[0-2]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'hh');
                        }
                    },
                    {
                        key: 'H',
                        regex: '1?[0-9]|2[0-3]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'H');
                        }
                    },
                    {
                        key: 'h',
                        regex: '[0-9]|1[0-2]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'h');
                        }
                    },
                    {
                        key: 'mm',
                        regex: '[0-5][0-9]',
                        apply: function (value) {
                            this.minutes = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'mm');
                        }
                    },
                    {
                        key: 'm',
                        regex: '[0-9]|[1-5][0-9]',
                        apply: function (value) {
                            this.minutes = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'm');
                        }
                    },
                    {
                        key: 'sss',
                        regex: '[0-9][0-9][0-9]',
                        apply: function (value) {
                            this.milliseconds = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'sss');
                        }
                    },
                    {
                        key: 'ss',
                        regex: '[0-5][0-9]',
                        apply: function (value) {
                            this.seconds = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'ss');
                        }
                    },
                    {
                        key: 's',
                        regex: '[0-9]|[1-5][0-9]',
                        apply: function (value) {
                            this.seconds = +value;
                        },
                        formatter: function (date) {
                            return dateFilter(date, 's');
                        }
                    },
                    {
                        key: 'a',
                        regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
                        apply: function (value) {
                            if (this.hours === 12) {
                                this.hours = 0;
                            }

                            if (value === 'PM') {
                                this.hours += 12;
                            }
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'a');
                        }
                    },
                    {
                        key: 'Z',
                        regex: '[+-]\\d{4}',
                        apply: function (value) {
                            var matches = value.match(/([+-])(\d{2})(\d{2})/),
                                sign = matches[1],
                                hours = matches[2],
                                minutes = matches[3];
                            this.hours += toInt(sign + hours);
                            this.minutes += toInt(sign + minutes);
                        },
                        formatter: function (date) {
                            return dateFilter(date, 'Z');
                        }
                    },
                    {
                        key: 'ww',
                        regex: '[0-4][0-9]|5[0-3]',
                        formatter: function (date) {
                            return dateFilter(date, 'ww');
                        }
                    },
                    {
                        key: 'w',
                        regex: '[0-9]|[1-4][0-9]|5[0-3]',
                        formatter: function (date) {
                            return dateFilter(date, 'w');
                        }
                    },
                    {
                        key: 'GGGG',
                        regex: $locale.DATETIME_FORMATS.ERANAMES.join('|').replace(/\s/g, '\\s'),
                        formatter: function (date) {
                            return dateFilter(date, 'GGGG');
                        }
                    },
                    {
                        key: 'GGG',
                        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
                        formatter: function (date) {
                            return dateFilter(date, 'GGG');
                        }
                    },
                    {
                        key: 'GG',
                        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
                        formatter: function (date) {
                            return dateFilter(date, 'GG');
                        }
                    },
                    {
                        key: 'G',
                        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
                        formatter: function (date) {
                            return dateFilter(date, 'G');
                        }
                    }
                ];

                jFormatCodeToRegex = [
                    {
                        key: 'yyyy',
                        regex: '\\d{4}',
                        apply: function (value) {
                            this.year = +value;
                        },
                        formatter: function (date) {
                            var _date = new Date();
                            _date.setFullYear(Math.abs(date.getFullYear()));
                            return jDateFilter(_date, 'yyyy');
                        }
                    },
                    {
                        key: 'yy',
                        regex: '\\d{2}',
                        apply: function (value) {
                            this.year = +value + 2000;
                        },
                        formatter: function (date) {
                            var _date = new Date();
                            _date.setFullYear(Math.abs(date.getFullYear()));
                            return jDateFilter(_date, 'yy');
                        }
                    },
                    {
                        key: 'y',
                        regex: '\\d{1,4}',
                        apply: function (value) {
                            this.year = +value;
                        },
                        formatter: function (date) {
                            var _date = new Date();
                            _date.setFullYear(Math.abs(date.getFullYear()));
                            return jDateFilter(_date, 'y');
                        }
                    },
                    {
                        key: 'M!',
                        regex: '0?[1-9]|1[0-2]',
                        apply: function (value) {
                            this.month = value - 1;
                        },
                        formatter: function (date) {
                            var value = date.getMonth();
                            if (/^[0-9]$/.test(value)) {
                                return jDateFilter(date, 'MM');
                            }

                            return jDateFilter(date, 'M');
                        }
                    },
                    {
                        key: 'MMMM',
                        regex: $locale_fa.DATETIME_FORMATS.MONTH.join('|'),
                        apply: function (value) {
                            this.month = $locale_fa.DATETIME_FORMATS.MONTH.indexOf(value);
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'MMMM');
                        }
                    },
                    {
                        key: 'MMM',
                        regex: $locale_fa.DATETIME_FORMATS.SHORTMONTH.join('|'),
                        apply: function (value) {
                            this.month = $locale_fa.DATETIME_FORMATS.SHORTMONTH.indexOf(value);
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'MMM');
                        }
                    },
                    {
                        key: 'MM',
                        regex: '0[1-9]|1[0-2]',
                        apply: function (value) {
                            this.month = value - 1;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'MM');
                        }
                    },
                    {
                        key: 'M',
                        regex: '[1-9]|1[0-2]',
                        apply: function (value) {
                            this.month = value - 1;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'M');
                        }
                    },
                    {
                        key: 'd!',
                        regex: '[0-2]?[0-9]{1}|3[0-1]{1}',
                        apply: function (value) {
                            this.date = +value;
                        },
                        formatter: function (date) {
                            var value = date.getDate();
                            if (/^[1-9]$/.test(value)) {
                                return jDateFilter(date, 'dd');
                            }

                            return jDateFilter(date, 'd');
                        }
                    },
                    {
                        key: 'dd',
                        regex: '[0-2][0-9]{1}|3[0-1]{1}',
                        apply: function (value) {
                            this.date = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'dd');
                        }
                    },
                    {
                        key: 'd',
                        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
                        apply: function (value) {
                            this.date = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'd');
                        }
                    },
                    {
                        key: 'EEEE',
                        regex: $locale_fa.DATETIME_FORMATS.DAY.join('|'),
                        formatter: function (date) {
                            return jDateFilter(date, 'EEEE');
                        }
                    },
                    {
                        key: 'EEE',
                        regex: $locale_fa.DATETIME_FORMATS.SHORTDAY.join('|'),
                        formatter: function (date) {
                            return jDateFilter(date, 'EEE');
                        }
                    },
                    {
                        key: 'HH',
                        regex: '(?:0|1)[0-9]|2[0-3]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'HH');
                        }
                    },
                    {
                        key: 'hh',
                        regex: '0[0-9]|1[0-2]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'hh');
                        }
                    },
                    {
                        key: 'H',
                        regex: '1?[0-9]|2[0-3]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'H');
                        }
                    },
                    {
                        key: 'h',
                        regex: '[0-9]|1[0-2]',
                        apply: function (value) {
                            this.hours = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'h');
                        }
                    },
                    {
                        key: 'mm',
                        regex: '[0-5][0-9]',
                        apply: function (value) {
                            this.minutes = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'mm');
                        }
                    },
                    {
                        key: 'm',
                        regex: '[0-9]|[1-5][0-9]',
                        apply: function (value) {
                            this.minutes = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'm');
                        }
                    },
                    {
                        key: 'sss',
                        regex: '[0-9][0-9][0-9]',
                        apply: function (value) {
                            this.milliseconds = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'sss');
                        }
                    },
                    {
                        key: 'ss',
                        regex: '[0-5][0-9]',
                        apply: function (value) {
                            this.seconds = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'ss');
                        }
                    },
                    {
                        key: 's',
                        regex: '[0-9]|[1-5][0-9]',
                        apply: function (value) {
                            this.seconds = +value;
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 's');
                        }
                    },
                    {
                        key: 'a',
                        regex: $locale_fa.DATETIME_FORMATS.AMPMS.join('|'),
                        apply: function (value) {
                            if (this.hours === 12) {
                                this.hours = 0;
                            }

                            if (value === 'PM') {
                                this.hours += 12;
                            }
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'a');
                        }
                    },
                    {
                        key: 'Z',
                        regex: '[+-]\\d{4}',
                        apply: function (value) {
                            var matches = value.match(/([+-])(\d{2})(\d{2})/),
                                sign = matches[1],
                                hours = matches[2],
                                minutes = matches[3];
                            this.hours += toInt(sign + hours);
                            this.minutes += toInt(sign + minutes);
                        },
                        formatter: function (date) {
                            return jDateFilter(date, 'Z');
                        }
                    },
                    {
                        key: 'ww',
                        regex: '[0-4][0-9]|5[0-3]',
                        formatter: function (date) {
                            return jDateFilter(date, 'ww');
                        }
                    },
                    {
                        key: 'w',
                        regex: '[0-9]|[1-4][0-9]|5[0-3]',
                        formatter: function (date) {
                            return jDateFilter(date, 'w');
                        }
                    },
                    {
                        key: 'GGGG',
                        regex: $locale_fa.DATETIME_FORMATS.ERANAMES.join('|').replace(/\s/g, '\\s'),
                        formatter: function (date) {
                            return jDateFilter(date, 'GGGG');
                        }
                    },
                    {
                        key: 'GGG',
                        regex: $locale_fa.DATETIME_FORMATS.ERAS.join('|'),
                        formatter: function (date) {
                            return jDateFilter(date, 'GGG');
                        }
                    },
                    {
                        key: 'GG',
                        regex: $locale_fa.DATETIME_FORMATS.ERAS.join('|'),
                        formatter: function (date) {
                            return jDateFilter(date, 'GG');
                        }
                    },
                    {
                        key: 'G',
                        regex: $locale_fa.DATETIME_FORMATS.ERAS.join('|'),
                        formatter: function (date) {
                            return jDateFilter(date, 'G');
                        }
                    }
                ];


            };

            this.init();

            function createParser(format, func, calendar) {
                var map = [], regex = format.split('');

                // check for literal values
                var quoteIndex = format.indexOf('\'');
                if (quoteIndex > -1) {
                    var inLiteral = false;
                    format = format.split('');
                    for (var i = quoteIndex; i < format.length; i++) {
                        if (inLiteral) {
                            if (format[i] === '\'') {
                                if (i + 1 < format.length && format[i + 1] === '\'') { // escaped single quote
                                    format[i + 1] = '$';
                                    regex[i + 1] = '';
                                } else { // end of literal
                                    regex[i] = '';
                                    inLiteral = false;
                                }
                            }
                            format[i] = '$';
                        } else {
                            if (format[i] === '\'') { // start of literal
                                format[i] = '$';
                                regex[i] = '';
                                inLiteral = true;
                            }
                        }
                    }

                    format = format.join('');
                }
                var referenceFormatCodeToRegex = calendar === 'Persian' ? jFormatCodeToRegex : formatCodeToRegex;
                angular.forEach(referenceFormatCodeToRegex, function (data) {
                    var index = format.indexOf(data.key);

                    if (index > -1) {
                        format = format.split('');

                        regex[index] = '(' + data.regex + ')';
                        format[index] = '$'; // Custom symbol to define consumed part of format
                        for (var i = index + 1, n = index + data.key.length; i < n; i++) {
                            regex[i] = '';
                            format[i] = '$';
                        }
                        format = format.join('');

                        map.push({
                            index: index,
                            key: data.key,
                            apply: data[func],
                            matcher: data.regex
                        });
                    }
                });

                return {
                    regex: new RegExp('^' + regex.join('') + '$'),
                    map: orderByFilter(map, 'index')
                };
            }

            this.filter = function (date, format, calendar) {
                if (!angular.isDate(date) || isNaN(date) || !format) {
                    return '';
                }

                format = (calendar === 'Persian' ? $locale_fa.DATETIME_FORMATS[format] : $locale.DATETIME_FORMATS[format]) || format;

                if ($locale.id !== localeId) {
                    this.init();
                }

                if (!this.formatters[format]) {
                    this.formatters[format] = createParser(format, 'formatter', calendar);
                }

                var parser = this.formatters[format],
                    map = parser.map;

                var _format = format;

                return map.reduce(function (str, mapper, i) {
                    var match = _format.match(new RegExp('(.*)' + mapper.key));
                    if (match && angular.isString(match[1])) {
                        str += match[1];
                        _format = _format.replace(match[1] + mapper.key, '');
                    }

                    var endStr = i === map.length - 1 ? _format : '';

                    if (mapper.apply) {
                        return str + mapper.apply.call(null, date) + endStr;
                    }

                    return str + endStr;
                }, '');
            };

            this.parse = function (input, format, baseDate, calendar) {
                if (!angular.isString(input) || !format) {
                    return input;
                }

                var jalaliProto = calendar === 'Persian' ? 'Jalali' : '';
                format = (calendar === 'Persian' ? $locale_fa.DATETIME_FORMATS[format] : $locale.DATETIME_FORMATS[format]) || format;
                format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

                if ($locale.id !== localeId) {
                    this.init();
                }

                if (!this.parsers[format]) {
                    this.parsers[format] = createParser(format, 'apply', calendar);
                }

                var parser = this.parsers[format],
                    regex = parser.regex,
                    map = parser.map,
                    results = input.match(regex),
                    tzOffset = false;
                if (results && results.length) {
                    var fields, dt;
                    if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
                        fields = {
                            year: baseDate['get' + jalaliProto + 'FullYear'](),
                            month: baseDate['get' + jalaliProto + 'Month'](),
                            date: baseDate['get' + jalaliProto + 'Date'](),
                            hours: baseDate.getHours(),
                            minutes: baseDate.getMinutes(),
                            seconds: baseDate.getSeconds(),
                            milliseconds: baseDate.getMilliseconds()
                        };
                    } else {
                        if (baseDate) {
                            $log.warn('dateparser:', 'baseDate is not a valid date');
                        }
                        fields = {year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
                    }

                    for (var i = 1, n = results.length; i < n; i++) {
                        var mapper = map[i - 1];
                        if (mapper.matcher === 'Z') {
                            tzOffset = true;
                        }

                        if (mapper.apply) {
                            mapper.apply.call(fields, results[i]);
                        }
                    }

                    var datesetter = tzOffset ? Date.prototype['setUTC' + jalaliProto + 'FullYear'] :
                        Date.prototype['set' + jalaliProto + 'FullYear'];
                    var timesetter = tzOffset ? Date.prototype.setUTCHours :
                        Date.prototype.setHours;

                    if (isValid(fields.year, fields.month, fields.date)) {
                        if (angular.isDate(baseDate) && !isNaN(baseDate.getTime()) && !tzOffset) {
                            dt = new Date(baseDate);
                            datesetter.call(dt, fields.year, fields.month, fields.date);
                            timesetter.call(dt, fields.hours, fields.minutes,
                                fields.seconds, fields.milliseconds);
                        } else {
                            dt = new Date(0);
                            datesetter.call(dt, fields.year, fields.month, fields.date);
                            timesetter.call(dt, fields.hours || 0, fields.minutes || 0,
                                fields.seconds || 0, fields.milliseconds || 0);
                        }
                    }

                    return dt;
                }
            };

            // Check if date is valid for specific month (and year for February).
            // Month: 0 = Jan, 1 = Feb, etc
            function isValid(year, month, date) {
                if (date < 1) {
                    return false;
                }

                if (month === 1 && date > 28) {
                    return date === 29 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
                }

                if (month === 3 || month === 5 || month === 8 || month === 10) {
                    return date < 31;
                }

                return true;
            }

            function toInt(str) {
                return parseInt(str, 10);
            }

            this.toTimezone = toTimezone;
            this.fromTimezone = fromTimezone;
            this.timezoneToOffset = timezoneToOffset;
            this.addDateMinutes = addDateMinutes;
            this.convertTimezoneToLocal = convertTimezoneToLocal;

            function toTimezone(date, timezone) {
                return date && timezone ? convertTimezoneToLocal(date, timezone) : date;
            }

            function fromTimezone(date, timezone) {
                return date && timezone ? convertTimezoneToLocal(date, timezone, true) : date;
            }

            //https://github.com/angular/angular.js/blob/4daafd3dbe6a80d578f5a31df1bb99c77559543e/src/Angular.js#L1207
            function timezoneToOffset(timezone, fallback) {
                var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
                return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
            }

            function addDateMinutes(date, minutes) {
                date = new Date(date.getTime());
                date.setMinutes(date.getMinutes() + minutes);
                return date;
            }

            function convertTimezoneToLocal(date, timezone, reverse) {
                reverse = reverse ? -1 : 1;
                var timezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset());
                return addDateMinutes(date, reverse * (timezoneOffset - date.getTimezoneOffset()));
            }
        }]);
