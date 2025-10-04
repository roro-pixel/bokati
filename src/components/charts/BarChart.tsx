import React from 'react';

export const BarChart: React.FC = () => {
  // Simulated data for months
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const revenues = [42, 58, 49, 63, 55, 67];
  const expenses = [31, 40, 35, 45, 42, 50];
  
  const maxValue = Math.max(...revenues, ...expenses) * 1.1;
  const chartHeight = 220;
  
  return (
    <div className="w-full">
      <div style={{ height: `${chartHeight}px` }} className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
          {[0, 25, 50, 75, 100].map((value, index) => (
            <div key={index} className="flex items-center h-0">
              <span>{value}</span>
            </div>
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((_, index) => (
            <div key={index} className="border-t border-gray-200 w-full h-0"></div>
          ))}
        </div>
        
        {/* Bars container */}
        <div className="absolute left-12 right-0 top-0 bottom-5 flex items-end">
          <div className="flex-1 flex justify-around items-end h-full">
            {months.map((month, index) => (
              <div key={index} className="flex flex-col items-center w-12">
                {/* Revenue bar */}
                <div 
                  className="w-4 bg-primary-500 rounded-t transition-all duration-500 ease-in-out"
                  style={{ 
                    height: `${(revenues[index] / maxValue) * chartHeight}px`,
                    marginRight: '2px'
                  }}
                ></div>
                
                {/* Expense bar */}
                <div 
                  className="w-4 bg-secondary-400 rounded-t ml-1 transition-all duration-500 ease-in-out"
                  style={{ 
                    height: `${(expenses[index] / maxValue) * chartHeight}px`,
                    position: 'absolute',
                    bottom: '0',
                    marginLeft: '6px'
                  }}
                ></div>
                
                {/* Month label */}
                <div className="mt-2 text-xs text-gray-500">
                  {month}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-primary-500 rounded mr-1"></div>
          <span className="text-xs text-gray-500">Revenus</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-secondary-400 rounded mr-1"></div>
          <span className="text-xs text-gray-500">Dépenses</span>
        </div>
      </div>
    </div>
  );
};