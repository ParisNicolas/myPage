import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function CardLink({ route, title, content }) {
  const cardLinkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Link to={route} style={cardLinkStyle}>
        <Card className="rounded h-100">
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{content}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </motion.div>
  );
}

export default CardLink;
