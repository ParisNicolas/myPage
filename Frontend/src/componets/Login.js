//Functionality
import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";

//Pretty
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import LoginForm from "./fragments/LoginForm";
import { InputGroup } from "react-bootstrap";

function Login() {
  const navigate = useNavigate();

  const users = useLoaderData();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [modal, setModal] = useState(false);
  const [sendForm, setSendForm] = useState(false);

  const submitModal = ()=>{
    setModal(false);
    setSendForm(true);
    document.activeElement.blur()
  }

  return (
    <div data-bs-theme="dark" className="bg-body-secondary vh-100">
      <div className="bg-dark-subtle p-2 ps-3">
        <Button variant="outline-danger" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Container
        className="d-flex justify-content-sm-center align-items-center h-100"
        coment="mt-sm-5 "
        fluid
      >
        <div className="text-body d-flex flex-wrap">
          <section
            className="bg-dark-subtle p-4 shadow rounded-start-3"
            style={{ minWidth: 380 }}
          >
            <h2 className="mb-5 text-center">Who are you?</h2>
            <Container className="d-flex flex-column">
              {users.map((usr, index) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    key={index}
                    className="bg-success d-flex align-items-center rounded mb-2 p-1 ps-2"
                    onClick={() => {
                      setUser(usr);
                      setModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <p className="m-0 ms-2 fs-4">{usr}</p>
                  </div>
                </motion.div>
              ))}
            </Container>
          </section>
          <section className="bg-body  p-3" style={{ minWidth: 320 }}>
            <h3 className="mt-2 mb-3">Another one:</h3>
            <LoginForm
              userState={[user, setUser]}
              pwdState={[pwd, setPwd]}
              signal={sendForm}
              setSignal={setSendForm}
            />
          </section>
        </div>
      </Container>

      <Modal
        show={modal}
        size="md"
        onHide={() => setModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-4">Password confirm:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <input
              placeholder="Pls write your password..."
              className="form-control"
              onChange={(e) => setPwd(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" ? submitModal():0}
              autoFocus
            />
            <Button
              onClick={submitModal}
            >
              Send
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;
