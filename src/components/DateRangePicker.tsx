import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import './DateRangePicker.css';

interface DateRangePickerProps {
  predefinedRanges?: Array<{ label: string; start: Date; end: Date }>;
  onChange: (range: [string, string], weekends: string[]) => void;
  clickOkay: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ predefinedRanges, onChange, clickOkay }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [isYearDropdownVisible, setYearDropdownVisible] = useState(false);
  const availableYears = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setYearDropdownVisible(false);
  };

  const isWeekend = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate.getDay() === 6 || normalizedDate.getDay() === 0;
  };

  const getDateRange = (start: Date, end: Date): Date[] => {
    const range = [];
    let currentDate = new Date(start);
    currentDate.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    while (currentDate <= end) {
      const dateToAdd = new Date(currentDate);
      dateToAdd.setUTCHours(0, 0, 0, 0);
      range.push(dateToAdd);
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return range;
  };

  const handleDateClick = (date: Date) => {
    // Normalize the selected date to start of the day using UTC
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    if (isWeekend(normalizedDate)) return;

    if (!startDate || (startDate && endDate)) {
      // Reset start and end dates
      setStartDate(normalizedDate);
      setEndDate(null);
    } else if (normalizedDate >= startDate) {
      // Set end date if selected date is greater than or equal to start date
      setEndDate(normalizedDate);

      const range = getDateRange(startDate, normalizedDate);
      const weekends = range
        .filter(isWeekend)
        .map((d) => {
          const year = d.getUTCFullYear();
          const month = String(d.getUTCMonth() + 1).padStart(2, "0");
          const day = String(d.getUTCDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        });

      // Call onChange with the correct range and weekends
      onChange([startDate.toISOString().split("T")[0], normalizedDate.toISOString().split("T")[0]], weekends);
    }
  };

  const handlePredefinedRangeClick = (range: string) => {
    // Create today's date based on the current year and month, and normalize the time
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let start: Date = new Date(today);
    let end: Date = new Date(today);

    // Adjust the start date based on the range selection (using UTC to ensure no timezone shifts)
    if (range === "last7Days") {
      start.setUTCDate(today.getUTCDate() - 6);
    } else if (range === "last30Days") {
      start.setUTCDate(today.getUTCDate() - 29);
    }

    // Set the state with the corrected start and end dates
    setStartDate(start);
    setEndDate(end);

    // Calculate the date range between the start and end dates
    const rangeDates = getDateRange(start, end);
    const weekends = rangeDates
      .filter(isWeekend)
      .map((d) => {
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
        const day = String(d.getUTCDate()).padStart(2, "0");

        // Construct a YYYY-MM-DD formatted string
        return `${year}-${month}-${day}`;
      });

    // Trigger the callback with the updated range and weekends
    onChange([start.toISOString().split("T")[0], end.toISOString().split("T")[0]], weekends);
  };

  const renderCalendar = () => {
    const weeks: JSX.Element[][] = [];
    const firstDayOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
    const lastDayOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0));

    let currentDate = new Date(firstDayOfMonth);
    currentDate.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay() + 1); // Start on Monday (UTC)

    while (currentDate <= lastDayOfMonth || currentDate.getUTCDay() !== 1) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateForCell = new Date(currentDate);
        dateForCell.setUTCHours(0, 0, 0, 0); // Normalize the date (UTC)

        const isSelected =
          startDate && endDate && dateForCell >= startDate && dateForCell <= endDate;
        const isDisabled = isWeekend(dateForCell);
        const isWeekendDate = isWeekend(dateForCell);
        const isCurrentMonth = dateForCell.getUTCMonth() === currentMonth;

        week.push(
          <td
            key={dateForCell.toISOString()}
            className={`day ${isDisabled ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isWeekendDate ? "weekend" : ""} ${isCurrentMonth ? "" : "not-current-month"
              }`}
            onClick={() => !isDisabled && handleDateClick(new Date(dateForCell))}
          >
            {dateForCell.getUTCDate()}
          </td>
        );
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Mo</th>
            <th>Tu</th>
            <th>We</th>
            <th>Th</th>
            <th>Fr</th>
            <th>Sa</th>
            <th>Su</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={index}>{week}</tr>
          ))}
        </tbody>
      </table>
    );
  };


  return (
    <div className="date-range-picker">
      <div className="header">
        {/* Carrot icon for previous month */}
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)}
          className="carrot-icon"
        />

        {/* Year and month display */}
        <span onClick={() => setYearDropdownVisible(!isYearDropdownVisible)} className="year-span">
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "short" })}, {currentYear}
        </span>

        {/* Carrot icon for next month */}
        <FontAwesomeIcon
          icon={faChevronRight}
          onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)}
          className="carrot-icon"
        />
      </div>

      {/* Year dropdown */}
      {isYearDropdownVisible && (
        <div className="year-dropdown">
          {availableYears.map((year) => (
            <div key={year} className="year-option" onClick={() => handleYearSelect(year)}>
              {year}
            </div>
          ))}
        </div>
      )}

      {/* Your calendar rendering function */}
      {renderCalendar()}
      <div>
        <button onClick={() => handlePredefinedRangeClick("last7Days")}>Last 7 Days</button>
        <button onClick={() => handlePredefinedRangeClick("last30Days")}>Last 30 Days</button>
        <button onClick={clickOkay}>OK</button>
      </div>

    </div>
  );
};

export default DateRangePicker;

