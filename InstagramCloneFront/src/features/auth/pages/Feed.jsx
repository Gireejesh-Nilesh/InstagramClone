import React, { useEffect } from "react";

import "../../post/style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading || !feed) {
    return (
      <main>
        <h1>Feed is loading...</h1>
      </main>
    );
  }
  return (
    <main className="feed-page">
      <div className="feed">
        <div className="posts">
          {feed.map((post) => (
            <Post key={post._id} post={post} user={post.user} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;
