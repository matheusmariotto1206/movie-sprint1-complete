const APEX_URL = 'https://oracleapex.com/ords/cinefinder/cinefinder';

export const getTopMovies = async () => {
  try {
    console.log('Fetching:', `${APEX_URL}/top-movies`);
    const response = await fetch(`${APEX_URL}/top-movies`);
    console.log('Response status:', response.status);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Data received:', JSON.stringify(data).substring(0, 200));
    return data.items;
  } catch (error) {
    console.error('APEX Error:', error.message);
    throw error;
  }
};
