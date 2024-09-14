import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import DateRangePicker from "./DateRangePicker";
import "./DateRangeBox.css";

const DateRangeBox: React.FC = () => {
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<string>("yyyy-MM-dd ~ yyyy-MM-dd");

    const handleDateRangeChange = (range: [string, string], weekends: string[]) => {
        console.log("rangeeeeeeee", range);
        setSelectedRange(`${range[0]} ~ ${range[1]}`);
    };

    const toggleCalendar = () => {
        setCalendarOpen(!isCalendarOpen);
    };

    const handleOkClick = () => {
        setCalendarOpen(false);
    };

    return (
        <div className="date-range-container">
            <div className="date-range-box" onClick={toggleCalendar}>
                <span>{selectedRange}</span>
                <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
            </div>
            {isCalendarOpen && (
                <div className="calendar-popup">
                    <DateRangePicker predefinedRanges={[]} onChange={handleDateRangeChange} clickOkay={handleOkClick} />
                </div>
            )}
        </div>
    );
};

export default DateRangeBox;
