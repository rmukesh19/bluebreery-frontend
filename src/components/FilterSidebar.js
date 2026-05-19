"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const filterCategories = [
  {
    id: 'price',
    name: 'Price',
    options: ['Under ₹499', '₹500 - ₹999', '₹1000 - ₹1499', '₹1500 - ₹1999', 'Over ₹2000']
  },
  {
    id: 'size',
    name: 'Size',
    options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  },
  {
    id: 'color',
    name: 'Color',
    options: ['Black', 'White', 'Blue', 'Grey', 'Olive', 'Beige', 'Red', 'Navy']
  },
  {
    id: 'fit',
    name: 'Fit',
    options: ['Slim Fit', 'Regular Fit', 'Oversized', 'Boxy Fit']
  },
  {
    id: 'pattern',
    name: 'Pattern',
    options: ['Solid', 'Printed', 'Striped', 'Checkered', 'Acid Wash']
  },
  {
    id: 'sleeve',
    name: 'Sleeve',
    options: ['Half Sleeve', 'Full Sleeve', 'Sleeveless']
  }
];

export default function FilterSidebar() {
  const [expanded, setExpanded] = useState({
    price: true,
    size: true,
    color: false,
    fit: false,
    pattern: false,
    sleeve: false
  });

  const toggleSection = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h2>FILTERS</h2>
        <button className="clear-all">Clear All</button>
      </div>

      <div className="filter-sections">
        {filterCategories.map((category) => (
          <div key={category.id} className="filter-group">
            <div 
              className="filter-group-header" 
              onClick={() => toggleSection(category.id)}
            >
              <span>{category.name}</span>
              {expanded[category.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expanded[category.id] && (
              <div className="filter-options">
                {category.options.map((option, idx) => (
                  <label key={idx} className="filter-label">
                    <input type="checkbox" />
                    <span className="checkbox-custom"></span>
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .filter-sidebar {
          width: 260px;
          padding: 0 10px;
          background: #fff;
          font-family: inherit;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .filter-header h2 {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.5px;
          margin: 0;
          color: #000;
        }

        .clear-all {
          font-size: 12px;
          color: #888;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: underline;
        }

        .offers-banner {
          background: #000;
          color: #fff;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .offers-banner::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .offer-badge {
          font-size: 10px;
          font-weight: 800;
          background: #FFDD00;
          color: #000;
          display: inline-block;
          padding: 2px 10px;
          border-radius: 4px;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .offers-banner h3 {
          font-size: 18px;
          font-weight: 900;
          margin: 0 0 5px;
          letter-spacing: 0.5px;
          color: #fff;
        }

        .offers-banner p {
          font-size: 12px;
          margin: 0;
          opacity: 0.9;
          color: #fff;
        }

        .filter-sections {
          display: flex;
          flex-direction: column;
        }

        .filter-group {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }

        .filter-group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 5px 0;
          user-select: none;
        }

        .filter-group-header span {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #222;
        }

        .filter-options {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: fadeIn 0.2s ease;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-label:hover .option-text {
          color: #000;
        }

        .filter-label input {
          display: none;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 1.5px solid #ddd;
          border-radius: 4px;
          position: relative;
          transition: all 0.2s ease;
        }

        .filter-label input:checked + .checkbox-custom {
          background: #000;
          border-color: #000;
        }

        .filter-label input:checked + .checkbox-custom::after {
          content: '✓';
          color: #fff;
          font-size: 12px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .option-text {
          font-size: 13px;
          color: #666;
          font-weight: 400;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </aside>
  );
}
