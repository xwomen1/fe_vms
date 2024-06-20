import PropTypes from "prop-types";
import React from "react";

const Tick = ({ tick, count, format }) => {
    const tickLabelStyle = {
        marginLeft: `${-(100 / count) / 2}%`,
        width: `${100 / count}%`,
        left: `${tick.percent}%`,
    };
    const TimeFormat = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
    const formattedTickValue = format(tick.value);

    return (
        <>
            <div
                className='react_time_range__tick_marker__large'
                style={{ left: `${tick.percent}%` }}
            />
            {TimeFormat.includes(formattedTickValue) && (
                <div className='react_time_range__tick_label' style={tickLabelStyle}>
                    {formattedTickValue}
                </div>
            )}
        </>
    );
};

Tick.propTypes = {
    tick: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired,
    }).isRequired,
    count: PropTypes.number.isRequired,
    format: PropTypes.func.isRequired,
};

Tick.defaultProps = { format: (d) => d };

export default Tick;