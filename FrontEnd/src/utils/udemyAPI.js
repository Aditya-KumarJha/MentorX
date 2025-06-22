import axios from 'axios';

// 🌐 Adjust to your actual backend URL if hosted elsewhere
const BASE_URL = 'http://localhost:5050';

// ✅ Fetch courses from MongoDB with support for category, search, pagination
export const fetchUdemyCoursesByCategory = async (
  category = 'development',
  page = 1,
  pageSize = 10,
  search = ''
) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/courses`, {
      params: {
        category,
        page,
        pageSize,
        search,
      },
    });

    return res.data; // Expected: { success, data, pagination }
  } catch (err) {
    console.error('❌ Error fetching courses from backend:', err.message);
    return {
      data: [],
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
      },
    };
  }
};
