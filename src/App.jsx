import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

function App() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isPreviousData } = useQuery({
    queryKey: ["todos", page],
    queryFn: async () => {
      const result = await axios.get(
        `http://localhost:3000/posts?_page=${page}&_limit=5`
      );
      const hasMore = Number(result.headers["x-total-count"]) > 5 * page;
      return { posts: result.data, hasMore };
    },
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const { posts, hasMore } = data;
  return (
    <div>
      <ul>
        {posts?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <span>Current Page: {page}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 1}
      >
        previous
      </button>
      <button
        onClick={() => {
          if (!isPreviousData && hasMore) {
            setPage((old) => old + 1);
          }
        }}
        disabled={!hasMore}
      >
        next
      </button>
    </div>
  );
}

export default App;
