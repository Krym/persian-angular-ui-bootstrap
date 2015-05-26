angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.position'])
    .factory('jDateService', [function(){
        return {
            loadPersian: function(flag){
                if(flag){moment.loadPersian();} else {moment.locale('en');}
            },
            dateFilter: function(inputDate, format){
                var daysOfWeek = [
                    'شنبه',
                    'یکشنبه',
                    'دوشنبه',
                    'سشنبه',
                    'چهارشنبه',
                    'پنجشنبه',
                    'جمعه'
                ];
                var daysOfWeekShort = [
                    'شـ',
                    'یـ',
                    'د',
                    'سـ',
                    'چـ',
                    'پـ',
                    'جـ'
                ];
                var jformat = '';
                switch (format) {
                    case 'yyyy-MM-dd':
                        jformat = 'jYYYY-jMM-jDD';
                        break;
                    case 'dd-MMMM-yyyy':
                        jformat = 'jDD-jMMMM-jYYYY';
                        break;
                    case 'yyyy/MM/dd':
                        jformat = 'jYYYY/jMM/jDD';
                        break;
                    case 'dd.MM.yyyy':
                        jformat = 'jDD.jMM.jYYYY';
                        break;
                    case 'shortDate':
                    case 'YY/M/D':
                        jformat = 'jYY/jM/jD';
                        break;
                    case 'dd':
                        jformat = 'jDD';
                        break;
                    case 'MMMM yyyy':
                        jformat = 'jMMMM jYYYY';
                        break;
                    case 'MMMM':
                        jformat = 'jMMMM';
                        break;
                    case 'yyyy':
                        jformat = 'jYYYY';
                        break;
                    case 'yy':
                        jformat = 'jYY';
                        break;
                    case 'mm':
                      jformat = 'jMM';
                    case 'EEE':
                    case 'EEEE':
                        jformat = 'E';
                        break;
                    default :
                        jformat = format;
                }
                var date = moment(inputDate);
                var jRetVal = date.format(jformat);
                if (jformat == 'E' && parseInt(jRetVal) > 0 && parseInt(jRetVal) < 8) {
                    var captured = parseInt(jRetVal) - 1;
                    if (format == 'EEEE')
                    {jRetVal = daysOfWeek[((captured + 2) % 7)];}
                    else
                    {jRetVal = daysOfWeekShort[((captured + 2) % 7)];}
                }
                return jRetVal;
            },
            getFirstDateOfMonth: function(date) {
                var retDate = new Date(date);
                var mdate = moment(date);
                var dayBack = parseInt(mdate.format('jDD')) - 1;
                retDate.setDate(retDate.getDate() - dayBack);
                return retDate;
            },
            getLastDateOfMonth: function(date) {
                var retDate = new Date(date);
                var mdate = moment(date);
                var enddate = moment(date).endOf('jMonth');
                var dayForward =  parseInt(enddate.format('jDD')) - parseInt(mdate.format('jDD'));
                retDate.setDate(retDate.getDate() + dayForward);
                return retDate;

            },
            sameMonth: function(date, activeDate) {
                var mDate = moment(date);
                var mActiveDate = moment(activeDate);
                return mDate.format('jMM') == mActiveDate.format('jMM');
            },
            getMonthList: function(date){
                var mDate = moment(date);
                var currentYear = mDate.format('jYYYY');
                var months = new Array(12);
                for(var i = 1;i<13;i++){
                    var d = currentYear + '/' + i + '/1';
                    months[i-1] = [moment(d,'jYYYY/jM/jD').format('YYYY'),moment(d,'jYYYY/jM/jD').format('M') - 1,
                        moment(d,'jYYYY/jM/jD').format('D')];
                }
                return months;
            },
            compareMonth: function(date1,date2){
                var mDate1 = moment(date1);
                var mDate2 = moment(date2);

              console.log(mDate1.format('jMM') , mDate2.format('jMM'));
                return mDate1.format('jYYYY') - mDate2.format('jYYYY') != 0
                  ? mDate1.format('jYYYY') - mDate2.format('jYYYY')
                  :  mDate1.format('jMM') - mDate2.format('jMM');
            },
            compareYear: function(date1,date2){
                var mDate1 = moment(date1);
                var mDate2 = moment(date2);
                return mDate1.format('jYYYY') - mDate2.format('jYYYY');
            },
            nextMonth: function(date,step){
                var jDate = moment(date);
                var month = parseInt(jDate.format('jM')) + step;
                var year = parseInt(jDate.format('jYYYY'));
                month = month - 1;  // minus m due to mathematical operations
                year = year + Math.floor( month / 12 ) ;
                month = month % 12;
                if(month < 0){month +=12;}
                month = month + 1;  // m real amount

                var nextMonthString = year + '/' + month + '/1' ;
                var nextMonth = moment(nextMonthString,'jYYYY/jM/jD');
                var y = nextMonth.format('YYYY'), m = nextMonth.format('M'), d = nextMonth.format('D');
                return  new Date(y,m-1,d);
            },
            nextYear: function(date,step){
                var jDate = moment(date);
                var year = parseInt(jDate.format('jYYYY')) + step;
                var nextYearString = year + '/' + jDate.format('jM') + '/1' ;
                var nextYear = moment(nextYearString,'jYYYY/jM/jD');
                var y = nextYear.format('YYYY'), m = nextYear.format('M'), d = nextYear.format('D');
                return  new Date(y,m-1,d);
            },
            getStartingYear: function(date, range) {
                var jDate = moment(date);
                var year = jDate.format('jYYYY');
                year = parseInt((year - 1) / range, 10) * range + 1;
                var yearString = year +'/'+jDate.format('jM')+'/'+jDate.format('jD');
                var startYear = moment(yearString,'jYYYY/jM/jD').format('YYYY');
                return parseInt(startYear);
            }
        };
    }])
    .constant('datepickerConfig', {
        formatDay: 'dd',
        formatMonth: 'MMMM',
        formatYear: 'yyyy',
        formatDayHeader: 'EEE',
        formatDayTitle: 'MMMM yyyy',
        formatMonthTitle: 'yyyy',
        datepickerMode: 'day',
        minMode: 'day',
        maxMode: 'year',
        showWeeks: true,
        startingDay: 6,
        yearRange: 20,
        minDate: null,
        maxDate: null,
        shortcutPropagation: false,
        rtl: false, //  add rtl option
        persian: false //  add persian option
    })

    .controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter',
        'datepickerConfig', 'jDateService', function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter,
                                                     datepickerConfig,jDateService) {
            var self = this,
                ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

            // Modes chain
            this.modes = ['day', 'month', 'year'];

            // Configuration attributes
            angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
                'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange', 'shortcutPropagation', 'rtl', 'persian'], function( key, index ) {
                self[key] = angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
            });

            // Watchable date attributes
            angular.forEach(['minDate', 'maxDate'], function( key ) {
                if ( $attrs[key] ) {
                    $scope.$parent.$watch($parse($attrs[key]), function(value) {
                        self[key] = value ? new Date(value) : null;
                        self.refreshView();
                    });
                } else {
                    self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
                }
            });

            $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
            $scope.maxMode = self.maxMode;
            $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);
            $scope.rtl = self.rtl;  //  add rtl to scope
            $scope.persian = self.persian;  //  add persian to scope
            if(angular.isDefined($attrs.initDate)) {
                this.activeDate = $scope.$parent.$eval($attrs.initDate) || new Date();
                $scope.$parent.$watch($attrs.initDate, function(initDate){
                    if(initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)){
                        self.activeDate = initDate;
                        self.refreshView();
                    }
                });
            } else {
                this.activeDate =  new Date();
            }

            $scope.isActive = function(dateObject) {
                if (self.compare(dateObject.date, self.activeDate) === 0) {
                    $scope.activeDateId = dateObject.uid;
                    return true;
                }
                return false;
            };

            this.init = function( ngModelCtrl_ ) {
                ngModelCtrl = ngModelCtrl_;

                ngModelCtrl.$render = function() {
                    self.render();
                };
            };

            this.render = function() {
                if ( ngModelCtrl.$viewValue ) {
                    var date = new Date( ngModelCtrl.$viewValue ),
                        isValid = !isNaN(date);

                    if ( isValid ) {
                        this.activeDate = date;
                    } else {
                        $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                    }
                    ngModelCtrl.$setValidity('date', isValid);
                }
                this.refreshView();
            };

            this.refreshView = function() {
                if ( this.element ) {
                    this._refreshView();

                    var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
                    ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
                }
            };

            this.createDateObject = function(date, format) {
                var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
                return {
                    date: date,
                    label: jDateService.dateFilter(date, format),
                    selected: model && this.compare(date, model) === 0,
                    disabled: this.isDisabled(date),
                    current: this.compare(date, new Date()) === 0,
                    customClass: this.customClass(date)
                };
            };

            this.isDisabled = function( date ) {
                return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
            };

            this.customClass = function( date ) {
                return $scope.customClass({date: date, mode: $scope.datepickerMode});
            };

            // Split array into smaller arrays
            this.split = function(arr, size) {
                var arrays = [];
                while (arr.length > 0) {
                    arrays.push(arr.splice(0, size));
                }
                return arrays;
            };

            $scope.select = function( date ) {
                if ( $scope.datepickerMode === self.minMode ) {
                    var dt = ngModelCtrl.$viewValue ? new Date( ngModelCtrl.$viewValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
                    dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
                    ngModelCtrl.$setViewValue( dt );
                    ngModelCtrl.$render();
                } else {
                    self.activeDate = date;
                    $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) - 1 ];
                }
            };

            $scope.move = function( direction ) {
                var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
                    month = direction * self.activeDate.getMonth() + direction * (self.step.months || 0);
                var y = direction * (self.step.years || 0), m = direction * (self.step.months || 0),day = 1;
                var movedDate = self.activeDate;
                if( y !== 0 ){
                    movedDate = jDateService.nextYear(self.activeDate,y);
                }
                if( m !== 0 ){
                    movedDate = jDateService.nextMonth(self.activeDate,m);
                }
                year = movedDate.getFullYear();
                month = movedDate.getMonth();
                day = movedDate.getDate();
                self.activeDate.setFullYear(year, month, day);
                self.refreshView();
            };

            $scope.toggleMode = function( direction ) {
                direction = direction || 1;

                if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
                    return;
                }

                $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) + direction ];
            };

            // Key event mapper
            $scope.keys = { 13:'enter', 32:'space', 33:'pageup', 34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down' };

            var focusElement = function() {
                $timeout(function() {
                    self.element[0].focus();
                }, 0 , false);
            };

            // Listen for focus requests from popup directive
            $scope.$on('datepicker.focus', focusElement);

            $scope.keydown = function( evt ) {
                var key = $scope.keys[evt.which];

                if ( !key || evt.shiftKey || evt.altKey ) {
                    return;
                }

                evt.preventDefault();
                if(!self.shortcutPropagation){
                    evt.stopPropagation();
                }

                if (key === 'enter' || key === 'space') {
                    if ( self.isDisabled(self.activeDate)) {
                        return; // do nothing
                    }
                    $scope.select(self.activeDate);
                    focusElement();
                } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
                    $scope.toggleMode(key === 'up' ? 1 : -1);
                    focusElement();
                } else {
                    self.handleKeyDown(key, evt);
                    self.refreshView();
                }
            };

            // handle language
            $scope.$watch('persian', function(val){
               jDateService.loadPersian($scope.persian);
            });
        }])

    .directive( 'datepicker', function () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/datepicker/datepicker.html',
            scope: {
                datepickerMode: '=?',
                dateDisabled: '&',
                customClass: '&',
                shortcutPropagation: '&?',
                rtl: '=?',
                persian: '=?'
            },
            require: ['datepicker', '?^ngModel'],
            controller: 'DatepickerController',
            link: function(scope, element, attrs, ctrls) {
                var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                if ( ngModelCtrl ) {
                    datepickerCtrl.init( ngModelCtrl );
                }
            }
        };
    })

    .directive('daypicker', ['dateFilter','jDateService', function (dateFilter,jDateService) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/datepicker/day.html',
            require: '^datepicker',
            link: function(scope, element, attrs, ctrl) {
                scope.showWeeks = ctrl.showWeeks;

                ctrl.step = { months: 1 };
                ctrl.element = element;

                var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                function getDaysInMonth( year, month ) {
                    return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
                }

                function getDates(startDate, n) {
                    var dates = new Array(n), current = new Date(startDate), i = 0;
                    current.setHours(12); // Prevent repeated dates because of timezone bug
                    while ( i < n ) {
                        dates[i++] = new Date(current);
                        current.setDate( current.getDate() + 1 );
                    }
                    return dates;
                }

                ctrl._refreshView = function() {
                    var year = ctrl.activeDate.getFullYear(),
                        month = ctrl.activeDate.getMonth(),
                        firstDayOfMonth = jDateService.getFirstDateOfMonth(new Date(ctrl.activeDate)), //  to set first day of jalali month for calendar
                        difference = ctrl.startingDay - firstDayOfMonth.getDay(),
                        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
                        firstDate = new Date(firstDayOfMonth);
                    while(firstDate.getDay() != ctrl.startingDay){
                        firstDate.setDate(firstDate.getDate() - 1);
                    }
                    /*if ( numDisplayedFromPreviousMonth > 0 ) {
                     firstDate.setDate( firstDate.getDate() - numDisplayedFromPreviousMonth + 1 );
                     }*/
                    // 42 is the number of days on a six-month calendar
                    var days = getDates(firstDate, 42);
                    for (var i = 0; i < 42; i ++) {
                        days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
                            secondary: !jDateService.sameMonth(days[i], ctrl.activeDate), // replace old comparing months method that was working for gregorian calendar  days[i].getMonth() !== month,
                            uid: scope.uniqueId + '-' + i
                        });
                    }

                    scope.labels = new Array(7);
                    for (var j = 0; j < 7; j++) {
                        scope.labels[j] = {
                            abbr: jDateService.dateFilter(days[j].date, ctrl.formatDayHeader),
                            full: jDateService.dateFilter(days[j].date, 'EEEE')
                        };
                    }

                    scope.title = jDateService.dateFilter(ctrl.activeDate, ctrl.formatDayTitle);
                    scope.rows = ctrl.split(days, 7);

                    if ( scope.showWeeks ) {
                        scope.weekNumbers = [];
                        var weekNumber = getISO8601WeekNumber( scope.rows[0][0].date ),
                            numWeeks = scope.rows.length;
                        while( scope.weekNumbers.push(weekNumber++) < numWeeks ) {}
                    }
                };

                ctrl.compare = function(date1, date2) {
                    return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
                };

                function getISO8601WeekNumber(date) {
                    var checkDate = new Date(date);
                    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
                    var time = checkDate.getTime();
                    checkDate.setMonth(0); // Compare with Jan 1
                    checkDate.setDate(1);
                    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
                }

                ctrl.handleKeyDown = function( key, evt ) {
                    var date = ctrl.activeDate.getDate();
                    var month = ctrl.activeDate.getMonth();
                    var year = ctrl.activeDate.getFullYear();
                    if (key === 'left') {
                        date = date - 1;   // up
                    } else if (key === 'up') {
                        date = date - 7;   // down
                    } else if (key === 'right') {
                        date = date + 1;   // down
                    } else if (key === 'down') {
                        date = date + 7;
                    } else if (key === 'pageup' || key === 'pagedown') {
                        /*var month = ctrl.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
                         ctrl.activeDate.setMonth(month, 1);
                         date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);*/
                        var direction = key === 'pageup' ? - 1 : 1;
                        var movedDate = jDateService.nextMonth(ctrl.activeDate,direction);
                        year = movedDate.getFullYear();
                        month = movedDate.getMonth();
                        date = movedDate.getDate();
                    } else if (key === 'home') {
                        year = jDateService.getFirstDateOfMonth(ctrl.activeDate).getFullYear();
                        month = jDateService.getFirstDateOfMonth(ctrl.activeDate).getMonth();
                        date = jDateService.getFirstDateOfMonth(ctrl.activeDate).getDate();
                    } else if (key === 'end') {
                        year = jDateService.getLastDateOfMonth(ctrl.activeDate).getFullYear();  // getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
                        month = jDateService.getLastDateOfMonth(ctrl.activeDate).getMonth();  // getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
                        date = jDateService.getLastDateOfMonth(ctrl.activeDate).getDate();  // getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
                    }
                    ctrl.activeDate.setFullYear(year);
                    ctrl.activeDate.setMonth(month);
                    ctrl.activeDate.setDate(date);
                };

                ctrl.refreshView();
            }
        };
    }])

    .directive('monthpicker', ['dateFilter','jDateService', function (dateFilter,jDateService) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/datepicker/month.html',
            require: '^datepicker',
            link: function(scope, element, attrs, ctrl) {
                ctrl.step = { years: 1 };
                ctrl.element = element;

                ctrl._refreshView = function() {
                    var months = new Array(12),
                        year = ctrl.activeDate.getFullYear();
                    //  get the list of days of the first days of jalaali months
                    var monthDays = jDateService.getMonthList(ctrl.activeDate);
                    for ( var i = 0; i < 12; i++ ) {
                        months[i] = angular.extend(ctrl.createDateObject(new Date(monthDays[i][0], monthDays[i][1],monthDays[i][2] ),
                            ctrl.formatMonth), {   //  replacing `new Date(year, i, 1)` by dates gotten from jDateService
                            uid: scope.uniqueId + '-' + i
                        });
                    }

                    scope.title = jDateService.dateFilter(ctrl.activeDate, ctrl.formatMonthTitle);
                    scope.rows = ctrl.split(months, 3);
                };

                ctrl.compare = function(date1, date2) {
                    return jDateService.compareMonth(date1,date2);  //  replace comparing month
                    //return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
                };

                ctrl.handleKeyDown = function( key, evt ) {
                    var date = ctrl.activeDate.getMonth();

                    if (key === 'left') {
                        date = date - 1;   // up
                    } else if (key === 'up') {
                        date = date - 3;   // down
                    } else if (key === 'right') {
                        date = date + 1;   // down
                    } else if (key === 'down') {
                        date = date + 3;
                    } else if (key === 'pageup' || key === 'pagedown') {
                        var year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
                        ctrl.activeDate.setFullYear(year);
                    } else if (key === 'home') {
                        date = 0;
                    } else if (key === 'end') {
                        date = 11;
                    }
                    ctrl.activeDate.setMonth(date);
                };

                ctrl.refreshView();
            }
        };
    }])

    .directive('yearpicker', ['dateFilter','jDateService', function (dateFilter,jDateService) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/datepicker/year.html',
            require: '^datepicker',
            link: function(scope, element, attrs, ctrl) {
                var range = ctrl.yearRange;

                ctrl.step = { years: range };
                ctrl.element = element;

                function getStartingYear( year ) {
                    return parseInt((year - 1) / range, 10) * range + 1;
                }

                ctrl._refreshView = function() {
                    var years = new Array(range);

                    for ( var i = 0, start = jDateService.getStartingYear(ctrl.activeDate,range); i < range; i++ ) {
                        years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
                            uid: scope.uniqueId + '-' + i
                        });
                    }

                    scope.title = [years[0].label, years[range - 1].label].join(' - ');
                    scope.rows = ctrl.split(years, 5);
                };

                ctrl.compare = function(date1, date2) {
                    return jDateService.compareYear(date1,date2);   //  replace compare month
                    //return date1.getFullYear() - date2.getFullYear();
                };

                ctrl.handleKeyDown = function( key, evt ) {
                    var date = ctrl.activeDate.getFullYear();

                    if (key === 'left') {
                        date = date - 1;   // up
                    } else if (key === 'up') {
                        date = date - 5;   // down
                    } else if (key === 'right') {
                        date = date + 1;   // down
                    } else if (key === 'down') {
                        date = date + 5;
                    } else if (key === 'pageup' || key === 'pagedown') {
                        date += (key === 'pageup' ? - 1 : 1) * ctrl.step.years;
                    } else if (key === 'home') {
                        date = jDateService.getStartingYear( ctrl.activeDate , range );
                    } else if (key === 'end') {
                        date = jDateService.getStartingYear( ctrl.activeDate , range ) + range - 1;
                    }
                    ctrl.activeDate.setFullYear(date);
                };

                ctrl.refreshView();
            }
        };
    }])

    .constant('datepickerPopupConfig', {
        datepickerPopup: 'yyyy-MM-dd',
        currentText: 'امروز',
        clearText: 'پاک کردن',
        closeText: 'بستن',
        closeOnDateSelection: true,
        appendToBody: false,
        showButtonBar: true
    })

    .directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'dateParser',
        'datepickerPopupConfig', 'jDateService',
        function ($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig,jDateService) {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    isOpen: '=?',
                    currentText: '@',
                    clearText: '@',
                    closeText: '@',
                    dateDisabled: '&',
                    customClass: '&'
                },
                link: function(scope, element, attrs, ngModel) {
                    var dateFormat,
                        closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
                        appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

                    scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

                    scope.getText = function( key ) {
                        return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
                    };

                    dateFormat = attrs.datepickerPopup || datepickerPopupConfig.datepickerPopup;
                    attrs.$observe('datepickerPopup', function(value, oldValue) {
                        var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
                        // Invalidate the $modelValue to ensure that formatters re-run
                        // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
                        if (newDateFormat !== dateFormat) {
                            dateFormat = newDateFormat;
                            ngModel.$modelValue = null;
                        }
                    });

                    // popup element used to display calendar
                    var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
                    popupEl.attr({
                        'ng-model': 'date',
                        'ng-change': 'dateSelection()'
                    });

                    function cameltoDash( string ){
                        return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
                    }

                    // datepicker element
                    var datepickerEl = angular.element(popupEl.children()[0]);
                    if ( attrs.datepickerOptions ) {
                        var options = scope.$parent.$eval(attrs.datepickerOptions);
                        if(options.initDate) {
                            scope.initDate = options.initDate;
                            datepickerEl.attr( 'init-date', 'initDate' );
                            delete options.initDate;
                        }
                        angular.forEach(options, function( value, option ) {
                            datepickerEl.attr( cameltoDash(option), value );
                        });
                    }

                    scope.watchData = {};
                    angular.forEach(['minDate', 'maxDate', 'datepickerMode', 'initDate', 'shortcutPropagation', 'rtl'], function( key ) {
                        if ( attrs[key] ) {
                            var getAttribute = $parse(attrs[key]);
                            scope.$parent.$watch(getAttribute, function(value){
                                scope.watchData[key] = value;
                            });
                            datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

                            // Propagate changes from datepicker to outside
                            if ( key === 'datepickerMode' ) {
                                var setAttribute = getAttribute.assign;
                                scope.$watch('watchData.' + key, function(value, oldvalue) {
                                    if ( value !== oldvalue ) {
                                        setAttribute(scope.$parent, value);
                                    }
                                });
                            }
                        }
                    });
                    if (attrs.dateDisabled) {
                        datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
                    }

                    if (attrs.showWeeks) {
                        datepickerEl.attr('show-weeks', attrs.showWeeks);
                    }

                    if (attrs.customClass){
                        datepickerEl.attr('custom-class', 'customClass({ date: date, mode: mode })');
                    }

                    // Internal API to maintain the correct ng-invalid-[key] class
                    ngModel.$$parserName = 'date';
                    function parseDate(viewValue) {
                        if (angular.isNumber(viewValue)) {
                            // presumably timestamp to date object
                            viewValue = new Date(viewValue);
                        }

                        if (!viewValue) {
                            return null;
                        } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                            return viewValue;
                        } else if (angular.isString(viewValue)) {
                            var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
                            if (isNaN(date)) {
                                return undefined;
                            } else {
                                return date;
                            }
                        } else {
                            return undefined;
                        }
                    }

                    function validator(modelValue, viewValue) {
                        var value = modelValue || viewValue;
                        if (angular.isNumber(value)) {
                            value = new Date(value);
                        }
                        if (!value) {
                            return true;
                        } else if (angular.isDate(value) && !isNaN(value)) {
                            return true;
                        } else if (angular.isString(value)) {
                            var date = dateParser.parse(value, dateFormat) || new Date(value);
                            return !isNaN(date);
                        } else {
                            return false;
                        }
                    }

                    ngModel.$validators.date = validator;
                    ngModel.$parsers.unshift(parseDate);

                    ngModel.$formatters.push(function (value) {
                        scope.date = value;
                        return ngModel.$isEmpty(value) ? value : jDateService.dateFilter(value, dateFormat);
                    });

                    // Inner change
                    scope.dateSelection = function(dt) {
                        if (angular.isDefined(dt)) {
                            scope.date = dt;
                        }
                        if (dateFormat) {
                            var date = scope.date ? jDateService.dateFilter(scope.date, dateFormat) : '';
                            element.val(date);
                        }
                        ngModel.$setViewValue(scope.date);

                        if ( closeOnDateSelection ) {
                            scope.isOpen = false;
                            element[0].focus();
                        }
                    };

                    // Detect changes in the view from the text box
                    ngModel.$viewChangeListeners.push(function () {
                        scope.date = ngModel.$viewValue;
                    });

                    var documentClickBind = function(event) {
                        if (scope.isOpen && event.target !== element[0]) {
                            scope.$apply(function() {
                                scope.isOpen = false;
                            });
                        }
                    };

                    var keydown = function(evt, noApply) {
                        scope.keydown(evt);
                    };
                    element.bind('keydown', keydown);

                    scope.keydown = function(evt) {
                        if (evt.which === 27) {
                            evt.preventDefault();
                            if (scope.isOpen) {
                                evt.stopPropagation();
                            }
                            scope.close();
                        } else if (evt.which === 40 && !scope.isOpen) {
                            scope.isOpen = true;
                        }
                    };

                    scope.$watch('isOpen', function(value) {
                        if (value) {
                            scope.$broadcast('datepicker.focus');
                            scope.position = appendToBody ? $position.offset(element) : $position.position(element);
                            scope.position.top = scope.position.top + element.prop('offsetHeight');

                            $document.bind('click', documentClickBind);
                        } else {
                            $document.unbind('click', documentClickBind);
                        }
                    });

                    scope.select = function( date ) {
                        if (date === 'today') {
                            var today = new Date();
                            if (angular.isDate(scope.date)) {
                                date = new Date(scope.date);
                                date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                            } else {
                                date = new Date(today.setHours(0, 0, 0, 0));
                            }
                        }
                        scope.dateSelection( date );
                    };

                    scope.close = function() {
                        scope.isOpen = false;
                        element[0].focus();
                    };

                    var $popup = $compile(popupEl)(scope);
                    // Prevent jQuery cache memory leak (template is now redundant after linking)
                    popupEl.remove();

                    if ( appendToBody ) {
                        $document.find('body').append($popup);
                    } else {
                        element.after($popup);
                    }

                    scope.$on('$destroy', function() {
                        $popup.remove();
                        element.unbind('keydown', keydown);
                        $document.unbind('click', documentClickBind);
                    });
                }
            };
        }])

    .directive('datepickerPopupWrap', function() {
        return {
            restrict:'EA',
            replace: true,
            transclude: true,
            templateUrl: 'template/datepicker/popup.html',
            link:function (scope, element, attrs) {
                element.bind('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        };
    });
