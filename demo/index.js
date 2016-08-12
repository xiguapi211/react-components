import React from 'react';
import ReactDOM from 'react-dom';
import MonthCalendar from '../src/components/MonthCalendar';
import Timeline from '../src/components/Timeline';

class AppComponent extends React.Component {
    renderTimeItemTitle (item, styleTit) {
        return (
            <div className="tit" title={item.name} style={styleTit} data-tooltip data-for="tooltipTimeline">{item.name}</div>
        );
    }
    render () {
        let timeLineProps = {
            isChange: null,
            renderTitle: this.renderTimeItemTitle.bind(this),
            eventList: [
                {
                    name: '事件描述：2014-01-02',
                    date: '2014-01-02'
                },
                {
                    name: '事件描述：2014-05-23',
                    date: '2014-05-23'
                },
                {
                    name: '事件描述：2014-11-24',
                    date: '2014-11-24'
                },
                {
                    name: '事件描述：2015-01-15',
                    date: '2015-01-15'
                },
                {
                    name: '事件描述：2016-01-30',
                    date: '2016-01-30'
                },
                {
                    name: '事件描述：2016-05-12',
                    date: '2016-05-12'
                },
                {
                    name: '事件描述：2016-06-06',
                    date: '2016-06-06'
                },
                {
                    name: '事件描述：2016-07-20',
                    date: '2016-07-20'
                }
            ]
        };
        return (
            <div>
                <Timeline {...timeLineProps} />
            </div>
        );
    }
}

ReactDOM.render(<AppComponent />, document.getElementById('component-container'));
