import { useState, useEffect } from 'react';

const UserPortraits = () => {
  const [portraitMap, setPortraitMap] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/portraits_getter/`
        );

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Server response:', data);
        setPortraitMap(data);
      } catch (error) {
        console.error('Fetch error: ', error);
        setError('Failed to load portraits');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {portraitMap.length === 0 ? (
        <div>No portraits found</div>
      ) : (
        portraitMap.map((portrait, index) => (
          <img
            key={index}
            src={`http://localhost:5000/assets/images/portraits${portrait}`}
            alt={`Portrait ${portrait}`}
            style={{ width: '100px', height: '100px', margin: '5px' }}
            onError={(e) => {
              console.error(`Failed to load image: ${portrait}`, e);
            }}
          />
        ))
      )}
    </div>
  );
};

export default UserPortraits;
