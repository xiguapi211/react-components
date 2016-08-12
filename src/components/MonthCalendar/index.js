/*
*/
'use strict';
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import './style.less';

let {
    Component,
    PropTypes
} = React;

const MAX_COLUMNS = 7;
const MAX_ROWS = 6;
const VIEW_INDEX = 1;
const DATE_FORMAT = 'YYYY-MM-DD';

let Day = React.createClass({
    propTypes: {
        day: PropTypes.object,
        isToday: PropTypes.bool,
        isSelected: PropTypes.bool,
        dayIndex: PropTypes.number,
        filler: PropTypes.bool,
        selectType: PropTypes.string,
        onDayClick: PropTypes.func
    },
    render: function () {
        var self = this;
        let {day, dayIndex, isToday, isSelected, filler} = this.props;
        let dayProps = {
            'data-date': day.format(DATE_FORMAT),
            onClick: ((d) => {
                return this.props.onDayClick.bind(this, d);
            })(day)
        }
        let dayClass = classNames({
            'day': true,
            'filler': filler,
            'today': isToday,
            'selected': (this.props.selectType === 'DAY' && isSelected),
        });
        if (filler === true) {
            return (
                <div className={dayClass} {...dayProps}>
                {day.get('date')}
                </div>
            );
        } else {
            return (
                <div className={dayClass} {...dayProps}>
                    {dayIndex + 1}
                </div>
            );
        }
    }
});

class MonthCalendar extends Component {
    static defaultProps = {
        weekHeadings: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        titleFormat: 'YYYY-MM-DD',
        prevTitle: '<',
        nextTitle: '>',
        selectType: 'DAY',      // 'DAY' or 'WEEK'
        startDate: moment().format(DATE_FORMAT),
        selectedDate: moment().format(DATE_FORMAT),
        selectedRange: [],
        onDateSelected: () => {}
    };

    static propTypes = {
        weekHeadings: PropTypes.array,
        // title current date format
        titleFormat: PropTypes.string,
        //
        prevTitle: PropTypes.string,
        nextTitle: PropTypes.string,
        //
        selectType: PropTypes.string,
        //
        startDate: PropTypes.string,
        //
        selectedDate: PropTypes.string,
        selectedRange: PropTypes.array,
        // event
        onDateSelected: PropTypes.func
    };

    constructor (props, context) {
        super(props, context);
        this.state = {
            selectedDate: moment(this.props.selectedDate).format(),
            currentMonth: moment(this.props.startDate).format(),
            calendarMonths: this._getInitStack()
        }
        this.scrolling = false
        this.weeks = [];
        this.visibleDateRange = [];
    };

    componentDidMount () {
        let calendar = this.refs.calendarArea;
        this.scrollUnitWidth = calendar.clientWidth;
        let calendarScroll = this.refs.calendarScroll;
        calendarScroll.style.left = ((this.scrollUnitWidth * VIEW_INDEX * -1)) + 'px';
    };

    _getInitStack () {
        let _stack = [];
        let startDate = this.props.startDate;
        _stack.push(moment(startDate).subtract(1, 'month').format());
        _stack.push(moment(startDate).format());
        _stack.push(moment(startDate).add(1, 'month').format());
        return _stack;
    };

    _util = {
        hasClass: function (obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        addClass: function (obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        },
        removeClass: function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }
    };

    getToParentLeft (element, parent) {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== parent && current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    };

    getToParentTop (element, parent) {
        let actualTop = element.offsetTop;
        let current = element.offsetParent;
        while (current !== parent && current !== null){
            actualTop += current. offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    };

    // event handler
    _handler = {
        _onPrevClick: function (event) {
            if (this.scrolling === true) {
                return;
            }
            this._scrollToCalendar(VIEW_INDEX - 1);
            setTimeout(() => {
                this._prependMonth();
                this.scrolling = false;
                this._scrollReset();
            }, 500);
        },
        _onNextClick: function (event) {
            if (this.scrolling === true) {
                return;
            }
            this._scrollToCalendar(VIEW_INDEX + 1);
            setTimeout(() => {
                this._appendMonth();
                this.scrolling = false;
                this._scrollReset();
            }, 500);
        },
        onDayClick: function (date, event) {
            let strDate = date.format(DATE_FORMAT);
            let selectedRange = [];
            let weekStart = moment(strDate).startOf('week');
            for (var i = 0; i < 7; i++) {
                selectedRange.push(weekStart.add(1, 'days').format(DATE_FORMAT));
            }
            this.setState({
                selectedDate: moment(strDate),
                selectedRange: selectedRange
            });
            // fire interface
            if (this.props.selectType === 'DAY') {
                this.props.onDateSelected([strDate]);
            } else if (this.props.selectType === 'WEEK') {
                this.props.onDateSelected(selectedRange);
            }

        }
    };
    _scrollToCalendar (itemIndex) {
        this.scrolling = true;
        let calendarScroll = this.refs.calendarScroll;
        this._util.addClass(calendarScroll, 'anim');
        calendarScroll.style.left = ((this.scrollUnitWidth * itemIndex * -1)) + 'px';
    };
    _scrollReset () {
        let calendarScroll = this.refs.calendarScroll;
        this._util.removeClass(calendarScroll, 'anim');
        calendarScroll.style.left = ((this.scrollUnitWidth * VIEW_INDEX * -1)) + 'px';
    };

    // 向前添加一个月
    _prependMonth () {
        var calendarMonths = this.state.calendarMonths;
        calendarMonths.unshift(moment(calendarMonths[0]).subtract(1, 'month').format());
        calendarMonths.pop();
        this.setState({
            calendarMonths: calendarMonths,
            currentMonth: calendarMonths[VIEW_INDEX]
        });
    };
    // 向后添加一个月
    _appendMonth () {
        var calendarMonths = this.state.calendarMonths;
        calendarMonths.push(moment(calendarMonths[calendarMonths.length - 1]).add(1, 'month').format());
        calendarMonths.shift();
        this.setState({
            calendarMonths: calendarMonths,
            currentMonth: calendarMonths[VIEW_INDEX]
        });
    };
    //
    renderTopBar () {
        let title = moment(this.state.currentMonth).format(this.props.titleFormat);
        const titleSpan = <span className="tit">{title}</span>;
        const prevProps = {
            ref: 'btnPrev',
            onClick: this._handler._onPrevClick.bind(this)
        }
        const nextProps = {
            ref: 'btnNext',
            onClick: this._handler._onNextClick.bind(this)
        }
        let btnPrev = <div className="ctrl prev ion ion-chevron-left" {...prevProps}>{this.props.prevTitle}</div>;
        let btnNext = <div className="ctrl next ion ion-chevron-right" {...nextProps}>{this.props.nextTitle}</div>;

        return (
            <div className="topbar">
                <div className="ctrls">
                {btnPrev}
                {titleSpan}
                {btnNext}
                </div>
            </div>
        );
    };

    renderHeader () {
        let { weekHeadings } = this.props;
        return (
            <div className="header">
                { weekHeadings.map((w, i) => {
                    let cls = i >= 5 ? 'end': ''
                    return <span key={i} className={cls}>{w}</span>
                })}
            </div>
        );
    };

    renderMonth (date, indx) {
        // first day of this month
        let dayStart = moment(date).startOf('month').format();
        let moDay = moment(dayStart);
        // numbers of days in this month
        let daysInMonth = moDay.daysInMonth();
        // 需要开头补白的数目（第一天不一定是周一）
        let offset = moDay.isoWeekday() - 1;
        // 用于第一列不同的时候的情况（周一，或者周日）
        let preFiller = 0;
        //
        let dayIndex = 0;
        //
        let weekRows = [];
        //
        this.weeks.length = 0;
        for (var i = 0; i < MAX_ROWS; i++) {
            this.weeks[i] = [];
            // 绘制行
            let days = [];
            // 行选择
            let rowMark = false;
            for (var j = 0; j < MAX_COLUMNS; j++) {
                // 前补白
                if (preFiller < offset) {
                    let fillerDay = moment(dayStart).subtract((offset - preFiller), 'days');
                    let fillerSelected = (moment(this.state.selectedDate).isSame(fillerDay, 'month') && moment(this.state.selectedDate).isSame(fillerDay, 'day'));
                    days.push(
                        <Day
                            key={`${i}-${j}`}
                            day={fillerDay}
                            filler={true}
                            isSelected={fillerSelected}
                            selectType={this.props.selectType}
                            onDayClick={this._handler.onDayClick.bind(this)}
                        />
                    );
                    this.weeks[i].push(fillerDay.format(DATE_FORMAT));
                    preFiller++;
                } else {
                    let newDay = moment(dayStart).set('date', dayIndex + 1);
                    // ?
                    let isToday = (moment().isSame(newDay, 'month') && moment().isSame(newDay, 'day'));
                    let isSelected = (moment(this.state.selectedDate).isSame(newDay, 'month') && moment(this.state.selectedDate).isSame(newDay, 'day'));
                    if (isSelected === true) {
                        rowMark = true;
                    }
                    if (dayIndex < daysInMonth) {
                        days.push(
                            <Day
                                key={`${i},${j}`}
                                day={newDay}
                                dayIndex={dayIndex}
                                isToday={isToday}
                                isSelected={isSelected}
                                filler={false}
                                selectType={this.props.selectType}
                                onDayClick={this._handler.onDayClick.bind(this)}
                            />
                        );
                        this.weeks[i].push(newDay.format(DATE_FORMAT))
                    }
                    dayIndex++;
                }

            }
            // 这个变量用于补空白行
            let fillerLastDate = null;
            if (days.length > 0 && days.length < 7) {
                // 后补白
                let fillerDayEnd = moment(dayStart).add(1, 'months');
                let addIndex = 0;
                for (var x = days.length; x < 7; x++) {
                    let newFiller = moment(fillerDayEnd).add(addIndex, 'days');
                    fillerLastDate = newFiller.format(DATE_FORMAT);
                    let fillerSelectedEnd = (moment(this.state.selectedDate).isSame(newFiller, 'month') && moment(this.state.selectedDate).isSame(newFiller, 'day'));
                    days.push(
                        <Day
                            key={x}
                            filler={true}
                            isSelected={fillerSelectedEnd}
                            day={newFiller}
                            selectType={this.props.selectType}
                            onDayClick={this._handler.onDayClick.bind(this)}
                        />
                    );
                    this.weeks[i].push(newFiller.format(DATE_FORMAT));
                    addIndex++;
                }
            }
            // 需要补充空行
            if (days.length === 0) {
            }
            let weekClass = classNames({
                'week-row': true,
                'selected': (this.props.selectType === 'WEEK' && rowMark)
            });

            weekRows.push(
                <div className={weekClass} key={`w-${weekRows.length}`}>{days}</div>
            );
        }
        // 可见的部分是中间的那个 month
        if (indx == 1) {
            this.visibleDateRange.length = 0;
            this.visibleDateRange.push(this.weeks[0][0]);
            let lastWeek = this.weeks[this.weeks.length - 1];
            lastWeek = lastWeek.length === 0 ? this.weeks[this.weeks.length - 2] : lastWeek;
            this.visibleDateRange.push(lastWeek[lastWeek.length - 1]);
        }
        return (
            <div key={moment(date).month()} className="month">{weekRows}</div>
        );
    };

    render () {
        return (
            <div className="month-calendar-wrapper">
                {this.renderTopBar()}
                <div className="content">
                    {this.renderHeader()}
                    <div className="calendar" ref="calendarArea">
                        <div className="scroll-area" ref="calendarScroll">
                        {
                            this.state.calendarMonths.map((date, index) => {
                                return this.renderMonth(date, index);
                            })
                        }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
module.exports = MonthCalendar;
