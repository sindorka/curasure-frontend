import { useEffect, useState } from "react";
import axios from "axios";

function ViewCovidArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/covid-articles");
        setArticles(res.data.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Loading articles...</p>;

  return (
    <div>
      <h2>📰 COVID-19 Articles</h2>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {articles.map((article) => (
            <div
              key={article._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem", color: "#2c3e50" }}>{article.title}</h3>
              <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{article.content}</p>
              <p style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                Published on: {new Date().toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewCovidArticles;
