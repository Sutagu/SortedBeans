import React, { useRef, useEffect, useState } from 'react';
const apiKey = import.meta.env.VITE_QUOTE_API_KEY;

const Quotes: React.FC = () => {
  const hasRun = useRef(false);
  const [quoteDescription, setQuoteDescription] = useState<string>(
    'The most effective way to do it, is to do it'
  );
  const [quoteAuthor, setQuoteAuthor] = useState<string>('Amelia Earhart');

  const fetchQuote = () => {
    const url = 'https://api.api-ninjas.com/v1/quotes';
    fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data[0].quote.length <= 150) {
            setQuoteAuthor(data[0].author);
            setQuoteDescription(data[0].quote);
          }
        }
      });
  };

  useEffect(() => {
    if (!hasRun.current) {
      fetchQuote();
      hasRun.current = true;
    }
  });
  return (
    <div className="text-blend text-sm text-center mt-15">
      <p className="max-w-8/10 m-auto pb-2">{quoteDescription}</p>
      <p className="text-xs">- {quoteAuthor}</p>
    </div>
  );
};

export default Quotes;
