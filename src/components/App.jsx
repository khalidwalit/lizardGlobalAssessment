import React, { useState, useEffect, useReducer } from 'react';

function App() {
  const initialState = {
    posts: [],
    filteredPosts: [],
    visiblePosts: 5,
  };

  const [{ posts, filteredPosts, visiblePosts }, setState] =
    useState(initialState);

  const [selectedCategories, dispatchSelectedCategories] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'ADD_CATEGORY':
          return [...state, action.payload];
        case 'REMOVE_CATEGORY':
          return state.filter((category) => category !== action.payload);
        default:
          return state;
      }
    },
    []
  );

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((json) => {
        setState((prevState) => ({
          ...prevState,
          posts: json.posts,
          filteredPosts: json.posts,
        }));
      });
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      dispatchSelectedCategories({ type: 'ADD_CATEGORY', payload: value });
    } else {
      dispatchSelectedCategories({ type: 'REMOVE_CATEGORY', payload: value });
    }
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setState((prevState) => ({
        ...prevState,
        filteredPosts: prevState.posts,
      }));
    } else {
      const filtered = posts.filter((post) =>
        post.categories.some((category) =>
          selectedCategories.includes(category.name)
        )
      );
      setState((prevState) => ({
        ...prevState,
        filteredPosts: filtered,
      }));
    }
  }, [selectedCategories, posts]);

  const loadMore = () => {
    setState((prevState) => ({
      ...prevState,
      visiblePosts: prevState.visiblePosts + 5,
    }));
  };

  return (
    <div>
      <header>
        <h1>Blog Posts</h1>
      </header>
      <section>
        <h2>Filter by Category:</h2>
        {posts.length > 0 &&
          Array.from(
            new Set(
              posts.reduce((categories, post) => {
                post.categories.forEach((category) => {
                  categories.add(category.name);
                });
                return categories;
              }, new Set())
            )
          ).map((categoryName) => (
            <div key={categoryName}>
              <label>
                <input
                  type="checkbox"
                  value={categoryName}
                  checked={selectedCategories.includes(categoryName)}
                  onChange={handleCategoryChange}
                />
                {categoryName}
              </label>
            </div>
          ))}
      </section>
      <main>
        <ul>
          {filteredPosts.slice(0, visiblePosts).map((data) => (
            <li key={data.id}>
              <article>
                <header>
                  <h2>{data.title}</h2>
                  {data.author && <p>{data.author.name}</p>}
                  {data.publishDate && <p>{data.publishDate}</p>}
                </header>
                <p>{data.summary}</p>
                {/* Add more properties here based on your data */}
              </article>
            </li>
          ))}
        </ul>
        {visiblePosts < filteredPosts.length && (
          <button onClick={loadMore}>Load More</button>
        )}
      </main>
      <footer>
        <p>&copy; 2023 My Blog</p>
      </footer>
    </div>
  );
}

export default App;
