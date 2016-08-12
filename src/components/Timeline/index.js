/**
 * Timeline 组件
 * author：liuyuan02
 * data结构
 {
    items: [
        { date: '2015-02-03', info: {}}
    ]
}
 */
'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';

import './style.less';

let {
    Component,
    PropTypes
} = React;

const DATE_FORMAT = 'YYYY-MM-DD';
const MAX_LEVEL = 4;
const FLAGS = [
    {
        index: 0,
        name: 'L1',
        height: 134,
        bgcolor: '#ac9cd6',
    },
    {
        index: 1,
        name: 'L2',
        height: 100,
        bgcolor: '#89adff'
    },
    {
        index: 2,
        name: 'L3',
        height: 64,
        bgcolor: '#72c4f8'
    },
    {
        index: 3,
        name: 'L4',
        height: 36,
        bgcolor: '#47cad2'
    }
]

const FLAG_WIDTH = 140;

class Timeline extends Component {
    static defaultProps = {
        eventList: [],
        gap: 50,
        renderTitle: (item, styleTit) => { return (<div className="tit" title={item.name} style={styleTit}>{item.name}</div>) }
    };

    static propTypes = {
        // data
        eventList: PropTypes.array,
        gap: PropTypes.number,
        renderTitle: PropTypes.func
    };

    constructor (props, context) {
        super(props, context);
        this.dateRange = [];    // 起止日期范围
        this.eventElementList = [];
        this.startDate = null;
        this.endDate = null;
        this.totalMonth = 0;

        this.init();
    };
    init () {
        let { eventList, gap } = this.props;
        eventList.sort((a, b) => {
            return a.date > b.date;
        });
        let _startDate = eventList[eventList.length - 1].date;
        let _endDate = eventList[0].date;
        this.startDate = moment(_startDate).add(2, 'months').set('date', 1);
        this.endDate = moment(_endDate).add(-2, 'months').set('date', 1);
        this.totalMonth = this.startDate.diff(this.endDate, 'month');
    };
    componentWillUpdate (nextProps) {
        // console.log('componentWillUpdate', nextProps);
        if (nextProps.isChange !== this.props.isChange) {
            this.groupRefresh = true;
        }
    };
    _getFlagLevel () {

    };
    _renderMarkup () {
        let { eventList, gap } = this.props;
        let containerWidth = this.totalMonth * gap;
        let offsetMonthX = 0;
        let style = {
            width: containerWidth + 'px',
        }
        let monthPart = [];
        for (let i = 0; i <= this.totalMonth; i++) {
            monthPart.push(this.startDate.clone().add(-1 * i, 'month'));
        }
        let monthList = [];
        let eventPointList = [];
        // event 位置
        let eventPosition = null;

        //console.log('eventList', eventList);
        //console.log('endDate', this.endDate.format(), this.startDate.format());
        _.forEach(monthPart, (item, index) => {
            let year = item.year();
            let month = item.month();
            month++;
            let stylePart = {
                left: offsetMonthX + 'px'
            }
            // 如果是1月，把年标志放进去
            if (month == 1) {
                monthList.push(
                    <div key={'key_' + year + month} className="horizontal-line" style={stylePart}>
                        <div className="mark">
                            <div className="year">{year}</div>
                            <div className="month">{month}</div>
                        </div>
                    </div>
                );
            } else {
                monthList.push(
                    <div key={'key_' + year + month} className="horizontal-line" style={stylePart}>
                        <div className="mark">
                            <div className="month">{month}</div>
                        </div>
                    </div>
                );
            }
            offsetMonthX += gap;
        });
        // 绘制节点倒序
        eventList.sort((a, b) => {
            return a.date < b.date;
        });
        _.forEach(eventList, (item, index) => {
            let mEvent = moment(item.date);
            let diff = this.startDate.diff(mEvent, 'month');
            let n = mEvent.get('date');
            var leftVal = Math.ceil((diff + 1) * gap - (gap / 31) * n);
            let styleEvent = {
                width: FLAG_WIDTH + 'px',
                left: leftVal + 'px'
            }
            let styleTitle = {};
            if (eventPosition === null) {
                styleEvent.height = FLAGS[0].height + 'px';
                styleTitle.backgroundColor = FLAGS[0].bgcolor;
                eventPosition = {};
                eventPosition[FLAGS[0].name] = {
                    position: leftVal + FLAG_WIDTH
                };
            } else {
                let _keys = _.keys(eventPosition);
                for (var i = 0; i < _keys.length; i++) {
                    let k = _keys[i];
                    if (eventPosition[k].position < leftVal) {
                        styleEvent.height = FLAGS[i].height + 'px';
                        styleTitle.backgroundColor = FLAGS[i].bgcolor;
                        eventPosition[_keys[i]].position = leftVal + FLAG_WIDTH;
                        break;
                    }
                }
                if (typeof styleEvent.height === 'undefined') {
                    if (_keys.length === MAX_LEVEL) {
                        // 超过 MAX_LEVEL 个重新开始
                        eventPosition[FLAGS[0].name].position = leftVal + FLAG_WIDTH;
                        styleEvent.height = FLAGS[0].height + 'px';
                        styleTitle.backgroundColor = FLAGS[0].bgcolor;
                    } else {
                        eventPosition[FLAGS[_keys.length].name] = {
                            position: leftVal + FLAG_WIDTH
                        };
                        styleEvent.height = FLAGS[_keys.length].height + 'px';
                        styleTitle.backgroundColor = FLAGS[_keys.length].bgcolor;
                    }
                }
            }

            eventPointList.push(
                <div key={'key_' + item.date} className="event" style={styleEvent}>
                    {this.props.renderTitle(item, styleTitle)}
                </div>
            );
        });
        let mainLine = <div className="main_line" style={style}></div>;
        return (
            <div className="container" style={style}>
                {mainLine}
                {monthList}
                {eventPointList}
            </div>
        );
    };
    _renderYearMarkup () {

    };
    // event handler
    _handler = {
        onFocus: function (event) {
        }
    };

    render () {
        return (
            <div className="timeline_wrapper">
                {this._renderMarkup()}
            </div>
        );
    };
}

module.exports = Timeline;
