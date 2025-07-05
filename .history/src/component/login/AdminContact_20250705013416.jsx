import { useEffect, useRef, useState } from "react";
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
  const toggleMenu = () => setMenuOpen((o) => !o);

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

  return (
    <div className="admin-grid">
      <button className="hamburger" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>

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

      <header className="admin-header">
        <h2>
          Butt <span className="grey-text">Networks</span>
        </h2>
      </header>

      <main className="admin-main">
        <h1 className="admin-main-heading">Contact Form Submissions</h1>

        {/* Fake Table Header */}
        <div className="table-header">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Message</div>
        </div>

        {/* Virtualized List */}
        <List
          height={400}
          itemCount={contactList.length}
          itemSize={120}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>
              <ContactRow contact={contactList[index]} />
            </div>
          )}
        </List>
      </main>
    </div>
  );
};

const ContactRow = ({ contact }) => {
  const { name = "", email = "", phone = "", message = "" } = contact || {};
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    setShowReadMore(message.length > 300);
  }, [message]);

  return (
    <div className="table-row">
      <div>{name}</div>
      <div>{email}</div>
      <div>{phone}</div>
      <div>
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
      </div>
    </div>
  );
};

export default AdminContact;
