import { useEffect, useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faEnvelope,
  faUsers,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FixedSizeList as List } from "react-window";
import "./style/Admin.css";

const AdminContact = () => {
  useEffect(() => {
    document.body.classList.add("body-admin");
    document.body.classList.remove("body");
  }, []);

  const [activeBtn, setActiveBtn] = useState("contact");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactList, setContactList] = useState([]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:3000/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        setContactList(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("🔥 fetch error:", err);
      }
    };
    getData();
  }, []);

  // Row renderer for virtualized list
  const Row = memo(({ index, style }) => {
    const contact = contactList[index];
    return (
      <div className="table-row" style={style}>
        <div className="table-cell">{contact?.name || ""}</div>
        <div className="table-cell">{contact?.email || ""}</div>
        <div className="table-cell">{contact?.phone || ""}</div>
        <div className="table-cell">
          <MessagePreview message={contact?.message || ""} />
        </div>
      </div>
    );
  });

  return (
    <div className="admin-grid">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Side Panel */}
      <div className={`admin-sidePanel ${menuOpen ? "show" : ""}`}>
        <h3 className="admin-heading">Admin Panel</h3>
        {[
          { id: "dashboard", icon: faHouse, label: "Dashboard" },
          { id: "contact", icon: faEnvelope, label: "Contact" },
          { id: "users", icon: faUsers, label: "Users" },
          { id: "settings", icon: faCog, label: "Settings" },
        ].map((btn) => (
          <button
            key={btn.id}
            className={`admin-btn ${activeBtn === btn.id ? "active" : ""}`}
            onClick={() => {
              setActiveBtn(btn.id);
              setMenuOpen(false);
            }}
          >
            <FontAwesomeIcon icon={btn.icon} />
            <p>{btn.label}</p>
          </button>
        ))}
      </div>

      {/* Header */}
      <header className="admin-header">
        <h2>
          Butt <span className="grey-text">Networks</span>
        </h2>
      </header>

      {/* Main */}
      <main className="admin-main">
        <h1 className="admin-main-heading">Contact Form Submissions</h1>
        <div className="virtualized-table">
          <div className="table-header">
            <div className="table-cell">Name</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Phone</div>
            <div className="table-cell">Message</div>
          </div>

          <List
            height={400}
            itemCount={contactList.length}
            itemSize={130}
            width="100%"
          >
            {Row}
          </List>
        </div>
      </main>
    </div>
  );
};

const MessagePreview = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  const showReadMore = message.length > 300;

  return (
    <>
      <p className={`message-preview ${expanded ? "expanded" : ""}`}>
        {expanded ? message : message.slice(0, 100) + (showReadMore ? "..." : "")}
      </p>
      {showReadMore && (
        <button
          className="read-more-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </>
  );
};

export default AdminContact;
