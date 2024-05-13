import { Container, Row, Col} from "react-bootstrap";
import HomeNavbar from "./fragments/HomeNavbar";
import CardLink from "./fragments/CardLink";

function Home() {

  return (
    <div
      className="bg-body-secondary"
      data-bs-theme="dark"
      style={{ minHeight: "100vh", height: "100%" }}
    >
      <HomeNavbar />
      <Container className="my-5">
        <Row>
          <Col md={4} className="my-2">
            <CardLink
              route="/storage"
              title="Storage"
              content="Get your own storage cloud service in your house"
            />
          </Col>
          <Col md={4} className="my-2">
            <CardLink
              route="/game"
              title="Game"
              content="This will involve having some games, some of them online"
            />
          </Col>
          <Col md={4} className="my-2">
            <CardLink
              route="/utils"
              title="Utils"
              content={
                <>
                  -Admin Panel
                  <br />
                  -Debugger
                </>
              }
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <CardLink
              route="/aboutme"
              title="About Me"
              content="Know something more about me."
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
