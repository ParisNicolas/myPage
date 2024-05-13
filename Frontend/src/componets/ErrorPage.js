import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.log(error);

  return (
    <Container
      className="d-flex flex-column align-items-center vh-100"
      fluid
    >
      <h1 className="mb-2" style={{marginTop:100}}>Oops!</h1>
      <div className="d-flex flex-row flex-wrap justify-content-center">
        <p>Sorry, an unexpected error has occurred: </p>
        <p className="text-danger">{error.status}</p>
      </div>
      <p>
        <i>{error.data}</i>
      </p>
      <Button autoFocus variant="danger" onClick={() => navigate(-1)}>
        Back
      </Button>
    </Container>
  );
}

export default ErrorPage;
