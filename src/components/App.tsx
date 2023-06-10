import React, { useState, useEffect, useReducer } from 'react';
import './App.css';

// Define the Post type
type Post = {
  id: number;
  title: string;
  author: {
    name: string;
  };
  publishDate: string;
  summary: string;
  categories: {
    id: number;
    name: string;
  }[];
};

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function App() {
  const initialState = {
    posts: [] as Post[],
    filteredPosts: [] as Post[],
    visiblePosts: 5,
  };

  const [state, setState] = useState(initialState);

  const [selectedCategories, dispatchSelectedCategories] = useReducer(
    (state: string[], action: { type: string; payload: string }) => {
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

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const filtered = state.posts.filter((post) =>
        post.categories.some((category) =>
          selectedCategories.includes(category.name)
        )
      );
      setState((prevState) => ({
        ...prevState,
        filteredPosts: filtered,
      }));
    }
  }, [selectedCategories, state.posts]);

  const loadMore = () => {
    setState((prevState) => ({
      ...prevState,
      visiblePosts: prevState.visiblePosts + 5,
    }));
  };

  return (
    <div className="container">
      <header>
        <h1 className="title">Blog Posts</h1>
      </header>
      <section>
        <h2 className="section-title">Filter by Category:</h2>
        {state.posts.length > 0 &&
          Array.from<string>(
            new Set(
              state.posts.reduce((categories: Set<string>, post) => {
                post.categories.forEach((category) => {
                  categories.add(category.name);
                });
                return categories;
              }, new Set<string>())
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
          {state.filteredPosts &&
            state.filteredPosts.slice(0, state.visiblePosts).map((data) => (
              <li key={data.id}>
                <article className="post">
                  <header>
                    <h2 className="post-title">{data.title}</h2>
                    {data.author && (
                      <p className="post-author">{data.author.name}</p>
                    )}
                    {data.publishDate && (
                      <p className="post-date">
                        {formatDate(data.publishDate)}
                      </p>
                    )}
                  </header>
                  <p className="post-summary">{data.summary}</p>
                </article>
              </li>
            ))}
        </ul>
        <p className="post-count">
          Showing {Math.min(state.visiblePosts, state.filteredPosts.length)} of{' '}
          {state.filteredPosts.length} posts
        </p>
        {state.visiblePosts < state.filteredPosts.length && (
          <div className="load-more-container">
            <button className="load-more-button" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </main>
      <footer>
        <p>&copy; 2023 My Blog</p>
      </footer>
    </div>
  );
}

export default App;
