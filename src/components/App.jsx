import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((json) => setPosts(json.posts));
  }, []);
  console.log(posts);

  return (
    <div>
      <ul>
        {posts &&
          posts.map((data) => {
            return (
              <>
                <li key={data.id}>
                  <h2>{data.title}</h2>
                  {data.author && <p>{data.author.name}</p>}
                </li>
              </>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
