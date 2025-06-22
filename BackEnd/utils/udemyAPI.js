import axios from 'axios';

const API_HOST = process.env.RAPIDAPI_HOST;
const API_KEYS = JSON.parse(process.env.RAPIDAPI_KEYS || '[]');

let currentKeyIndex = 0;

const getNextApiKey = () => {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
};

export const fetchAllUdemyCoursesByCategory = async (category) => {
  let allCourses = [];
  let page = 1;
  const pageSize = 10;

  while (true) {
    const body = {
      page,
      page_size: pageSize,
      sort: 'popularity',
      locale: 'en_US',
      extract_pricing: true,
    };

    const apiKey = getNextApiKey();
    const url = `https://${API_HOST}/v1/udemy/category/${category}`;

    try {
      const res = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': API_HOST,
          'X-RapidAPI-Key': apiKey,
        },
      });

      const newCourses = res.data?.data?.courses || [];
      allCourses.push(...newCourses);

      const totalPages = res.data?.data?.pagination?.total_pages || 1;
      if (page >= totalPages) break;

      page++;
    } catch (err) {
      if (err.response?.status === 429) {
        console.warn(`Rate limit hit for key ${apiKey}. Trying next...`);
        continue;
      } else {
        console.error(`Failed at page ${page}:`, err.message);
        break;
      }
    }
  }

  return allCourses;
};
