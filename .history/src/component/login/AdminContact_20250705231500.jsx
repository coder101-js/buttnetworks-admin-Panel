import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faBars,
  faHouse,
  faEnvelope,
  faUsers,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import "./style/Admin.css";

const AdminContact = () => {
  const navigate = useNavigate();
  // Body theming
  useEffect(() => {
    document.body.classList.add("body-admin");
    document.body.classList.remove("body");
  }, []);

  // Sidebar + menu
  const [activeBtn, setActiveBtn] = useState("contact");
  const [menuOpen, setMenuOpen] = useState(false);

  // Contact data
  const [contactList, setContactList] = useState([]);
  const toggleMenu = () => setMenuOpen((o) => !o);

  // Fetch page 1 of contacts on mount
  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch("http://localhost:3000/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        setContactList(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        navigate("login/email");
        console.error("🔥 fetch error:", err);
      }
    };
    validate();
    async () => {
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

      {/* Main Content */}
      <main className="admin-main">
        <h1 className="admin-main-heading">Contact Form Submissions</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {contactList.map((contact, idx) => (
              <ContactRow key={contact._id || idx} contact={contact} />
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

const ContactRow = ({ contact }) => {
  const { name = "", email = "", phone = "", message = "" } = contact || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const messageRef = useRef(null);

  // Show "Read More" if message exceeds ~300 chars
  useEffect(() => {
    setShowReadMore(message.length > 300);
  }, [message]);

  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>
        <div className="message-container">
          <p
            ref={messageRef}
            className={`message-preview ${isExpanded ? "expanded" : ""}`}
          >
            {message}
          </p>
          {showReadMore && (
            <button
              className="read-more-btn"
              onClick={() => setIsExpanded((e) => !e)}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AdminContact;
