import { useState } from "react";
import axios from "axios";
import "./InsuranceProviderDasboard.css"; // keep using your shared CSS

function PublishCovidArticles({ providerId }: { providerId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/api/covid-articles", {
        providerId,
        title,
        content,
      });
      alert("✅ Article published!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("❌ Error publishing article:", err);
    }
  };

  return (
    <div className="publish-article-page">
      <h2 className="page-title">📰 Publish COVID-19 Article</h2>
      <form onSubmit={handleSubmit} className="publish-form">
        <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input-field"
        />
        </div>
        <div className="form-group">

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          placeholder="Enter detailed content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          className="textarea-field"
        />
        </div>

        <button type="submit" className="primary-btn">Publish Article</button>
      </form>
    </div>
  );
}

export default PublishCovidArticles;
