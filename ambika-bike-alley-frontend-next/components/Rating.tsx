import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// 1. Define what props this component accepts
interface RatingProps {
  value: number;
  text?: string;
  color?: string;
}

// 2. Set the default color directly in the parameters (The modern React way!)
const Rating = ({ value, text, color = '#f8e825' }: RatingProps) => {
  return (
    <div className="flex items-center">
      {/* We group the stars together and apply the color */}
      <div className="flex" style={{ color }}>
        {/* Star 1 */}
        <span>
          {value >= 1 ? <FaStar /> : value >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>

        {/* Star 2 */}
        <span>
          {value >= 2 ? <FaStar /> : value >= 1.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>

        {/* Star 3 */}
        <span>
          {value >= 3 ? <FaStar /> : value >= 2.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>

        {/* Star 4 */}
        <span>
          {value >= 4 ? <FaStar /> : value >= 3.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>

        {/* Star 5 */}
        <span>
          {value >= 5 ? <FaStar /> : value >= 4.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>
      </div>

      {/* The review text, spaced perfectly with Tailwind */}
      {text && <span className="text-sm text-gray-600 ml-2 font-medium">{text}</span>}
    </div>
  );
};

export default Rating;