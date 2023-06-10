import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((json) => {
        setPosts(json.posts);
        setFilteredPosts(json.posts);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((category) => category !== value)
      );
    }
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.categories.some((category) =>
          selectedCategories.includes(category.name)
        )
      );
      setFilteredPosts(filtered);
    }
  }, [selectedCategories, posts]);

  return (
    <div>
      <div>
        <label>Filter by Category:</label>
        {posts.length > 0 && (
          <>
            {Array.from(
              new Set(
                posts.reduce((categories, post) => {
                  console.log(categories);
                  post.categories.forEach((category) => {
                    categories.add(category.name);
                  });
                  return categories;
                }, new Set())
              )
            ).map((categoryName) => (
              <div key={categoryName}>
                <input
                  type="checkbox"
                  value={categoryName}
                  checked={selectedCategories.includes(categoryName)}
                  onChange={handleCategoryChange}
                />
                <label>{categoryName}</label>
              </div>
            ))}
          </>
        )}
      </div>
      <ul>
        {filteredPosts.map((data) => (
          <li key={data.id}>
            <h2>{data.title}</h2>
            {data.author && <p>{data.author.name}</p>}
            {data.publishDate && <p>{data.publishDate}</p>}
            <p>{data.summary}</p>
            {/* Add more properties here based on your data */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
