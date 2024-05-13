import { useEffect, useState, useRef } from "react";
import { redirect } from "react-router-dom";
import axios from "axios";
import useAuth from "../../context/AuthProvider";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function LoginForm(props) {
  const userRegex = /^[a-zA-Z]{4,20}(?: [a-zA-Z]{4,20})?$/;
  const pwdRegex = /^[!@#%&*_+-:;.=/0-9a-zA-Z]{4,20}$/;

  const { setAuth } = useAuth();

  const [action, setAction] = useState("login");
  const [errMsg, setErrMsg] = useState("");

  const [user, setUser] = props.userState;
  const [validName, setValidName] = useState(true);
  const userRef = useRef();

  const [pwd, setPwd] = props.pwdState;
  const [validPwd, setValidPwd] = useState(true);
  const pwdRef = useRef();

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  useEffect(() => {
    if(props.signal){
        handleSubmit();
        props.setSignal(false);
    }
  }, [props.signal]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const route = action === "login" ? "/signIn" : "/signUp";

    //Checking for the registration
    if (action === "register") {
      //Regex
      const result1 = userRegex.test(user);
      const result2 = pwdRegex.test(pwd);
      console.log(result1, result2);
      setValidName(result1);
      setValidPwd(result2);

      if (!result1 || !result2) {
        if (!result1) userRef.current.focus();
        if (!result2) pwdRef.current.focus();
        return;
      }
    } else {
      //clear if is login
      setErrMsg("");
      setValidName(true);
      setValidPwd(true);
    }

    //Request
    try {
      const response = await axios.post(
        route,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      //Response
      console.log(response?.data);
      const { token, username, roles } = response?.data;
      setAuth({ token, username, roles });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.error(err.response);
      setErrMsg(`Login failed: ${err.response?.statusText}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Alert variant="danger" show={errMsg}>
        {errMsg}
      </Alert>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username:</Form.Label>
        <Form.Control
          ref={userRef}
          id="username"
          type="text"
          placeholder="Type your username..."
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <Form.Text
          id="passwordHelpBlock"
          className={"text-danger " + (validName ? "d-none" : "d-block")}
        >
          Your username must be 4-20 characters long, contain only letters and
          just can have two words.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password:</Form.Label>
        <Form.Control
          ref={pwdRef}
          id="password"
          type="password"
          placeholder="Type your password..."
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <Form.Text
          id="passwordHelpBlock"
          className={"text-danger " + (validPwd ? "d-none" : "d-block")}
        >
          Your password must be 4-20 characters long, without spaces and only
          with this simbols: !@#%&*_+-:;.=/.
        </Form.Text>
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          type="submit"
          onClick={() => setAction("register")}
        >
          Register
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={() => setAction("login")}
        >
          Sign In
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;
