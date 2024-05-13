import useAuth from "../../context/AuthProvider";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
//import NavDropdown from 'react-bootstrap/NavDropdown';

function HomeNavbar() {
  const { auth } = useAuth();

  return (
    <Navbar expand="sm" bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Brand className="ms-2" as={Link} to="/">
            myHome
          </Navbar.Brand>
          <Nav className="ms-2">
            <Nav.Link as={Link} to="/storage">
              Files
            </Nav.Link>
            <Nav.Link as={Link} to="/game">
              Game
            </Nav.Link>
            <NavDropdown title="Utils" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/Admin">
                Admin Panel
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Debugger">
                Debugge
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/aboutme">
              AboutMe
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        { !auth.username ?
          <Link to="/login">
            <Button variant="outline-danger">LogIn</Button>
          </Link>
          :
          <h2>{auth.username}</h2>
        }
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Container>
    </Navbar>
  );
}

export default HomeNavbar;
