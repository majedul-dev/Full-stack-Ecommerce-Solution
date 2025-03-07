"use client"
import { useState } from 'react';
import { StarIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const mockReviews = [
  {
    id: 1,
    user: "John D.",
    rating: 4,
    date: "2025-03-15",
    title: "Great product but...",
    body: "The watch works perfectly, but battery life could be better. The health tracking features are excellent.",
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 5,
    date: "2025-03-14",
    title: "Best smartwatch I've owned",
    body: "Absolutely love the seamless integration with my phone. The screen quality is outstanding.",
    helpful: 8,
    verified: true
  }
];

const ProductReviews = ({ reviews = mockReviews, averageRating = 4.5, totalReviews = 2 }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [votes, setVotes] = useState({});
  const [reportedReviews, setReportedReviews] = useState([]);

  const handleHelpful = (reviewId) => {
    setVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  const handleReport = (reviewId) => {
    setReportedReviews(prev => [...prev, reviewId]);
  };

  const ratingDistribution = {
    5: 60,
    4: 30,
    3: 5,
    2: 3,
    1: 2
  };

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Rating Summary */}
        <div className="md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold">{averageRating}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <div className="text-gray-600">{totalReviews} reviews</div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="w-12">{rating} stars</div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${ratingDistribution[rating]}%` }}
                  />
                </div>
                <div className="w-12 text-right">{ratingDistribution[rating]}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:w-2/3 space-y-8">
          {/* Sorting Controls */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">All Reviews</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{review.user}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                      {review.verified && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">Verified Purchase</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!reportedReviews.includes(review.id) && (
                    <button 
                      onClick={() => handleReport(review.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Report
                    </button>
                  )}
                </div>

                <h5 className="mt-2 font-medium">{review.title}</h5>
                <p className="mt-2 text-gray-600">{review.body}</p>

                <div className="mt-4 flex items-center gap-4">
                  <button 
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                    {votes[review.id] || review.helpful} Helpful
                  </button>
                  <button className="text-sm text-gray-600 hover:text-blue-600">
                    Comment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 border rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;