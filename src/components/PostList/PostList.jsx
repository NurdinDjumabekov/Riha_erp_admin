import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import styles from "./postList.module.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    // Делаем запрос
    console.log("useEffect");
    API.get("posts").then((resp) => {
      setPosts(resp.data), setFilteredPosts(resp.data);
    });
  }, []);

  useEffect(() => {
    // Делаем фильтр
    console.log("useeffect searchterm");
    let filtered = posts.filter((p) => {
      if (
        p.title.toLowerCase().includes(search.toLocaleLowerCase()) ||
        p.body.includes(search)
      )
        return true;
      else return false;
    });

    let lastFiltered =
      userId > 0 ? filtered.filter((p) => p.userId == userId) : filtered;
    setFilteredPosts(lastFiltered);
  }, [search, userId]);

  return (
    <div className={styles.postList}>
      <div className={styles.forSearch}>
        <span htmlFor="">Поиск по UserId: </span>
        <input
          type="number"
          className={styles.inputNumber}
          placeholder="Введите userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className={styles.forSearch}>
        <span htmlFor="">Поиск по заголовку и тексту: </span>
        <input
          type="text"
          value={search}
          placeholder="Введите заголовок"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredPosts.map((p) => (
        <Link key={p.id} to={`/posts/${p.id}`}>
          <div className={styles.List}>
            <h2>{p.title}</h2>
            <p>{p.body}</p>
            <p className={styles.userId}>User Id: {p.userId}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default PostList;
