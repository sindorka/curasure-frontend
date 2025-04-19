import { useEffect, useState } from "react";
import axios from "axios";

function ViewCovidArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
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
        <div className="article-grid">
          {articles.map((article) => (
            <div
              key={article._id}
             className="article-card"
             onClick={() => setSelected(article)}
            >
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">{article.content.length > 120 ? article.content.slice(0, 120).trim() + "..." : article.content} </p>
              <p className="article-date">
                Published on: {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <h2 className="article-title">{selected.title}</h2>
            <p className="article-full">{selected.content}</p>
            <button 
              className="cancel-btn" 
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCovidArticles;
