import React from 'react';

export const PieChart: React.FC = () => {
  // Sample data
  const data = [
    { name: 'Achats', value: 35, color: '#3B82F6' },
    { name: 'Salaires', value: 30, color: '#F97316' },
    { name: 'Loyers', value: 15, color: '#10B981' },
    { name: 'Taxes', value: 10, color: '#EF4444' },
    { name: 'Autres', value: 10, color: '#8B5CF6' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative h-64 w-64">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.map((item, index) => {
            // Calculate the angles for the pie slice
            const startAngle = currentAngle;
            const angle = (item.value / total) * 360;
            currentAngle += angle;
            const endAngle = currentAngle;
            
            // Convert angles to radians
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            
            // Calculate coordinates
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            // Create the arc flag
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Create the SVG path
            const pathData = `
              M 50 50
              L ${x1} ${y1}
              A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{item.name}: {item.value}%</title>
              </path>
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs">{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};