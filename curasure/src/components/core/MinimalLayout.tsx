import { ReactNode, FC } from "react";  // ⬅️ Also import FC (FunctionComponent)
import { useNavigate } from "react-router-dom";
import './MinimalLayout.css';

interface MinimalLayoutProps {
  children: ReactNode;
}

// ✅ Explicitly tell that this is a Functional Component with props
const MinimalLayout: FC<MinimalLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="minimal-layout">
      <nav className="minimal-navbar">
        <div className="navbar-left" onClick={() => navigate("/")}>
          CuraSure
        </div>
      </nav>

      <div className="minimal-content">
        {children}
      </div>
    </div>
  );
};

export default MinimalLayout;
