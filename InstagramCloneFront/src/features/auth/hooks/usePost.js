import {getFeed} from "../services/post.api";
import {useContext} from "react";
import {PostContext} from "../../post/post.context";

export const usePost = () =>{
  const context = useContext(PostContext);

  const {loading, setLoading, Post, setPost, feed, setFeed} = context;

  const handleGetFeed = async () =>{
    setLoading(true);

    const data = await getFeed();
    setFeed(data.posts);
    setLoading(false);
  }

  return {loading, Post, feed, handleGetFeed};
}