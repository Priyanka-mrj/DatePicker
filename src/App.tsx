import React from 'react';
import DateRangeBox from './components/DateRangeBox'; // Adjust the path as needed

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Weekday Date Range Picker</h1>
      <DateRangeBox />
    </div>
  );
};

export default App;
