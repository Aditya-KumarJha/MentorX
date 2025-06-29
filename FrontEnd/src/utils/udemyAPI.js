import axios from '../utils/axios';

export const fetchUdemyCoursesByCategory = async (
  category = 'development',
  page = 1,
  pageSize = 10,
  search = ''
) => {
  try {
    const res = await axios.get(`/api/courses`, {
      params: {
        category,
        page,
        pageSize,
        search,
      },
    });

    return res.data; 
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
