import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../service/userService";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
// import "../styles/profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile(token);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Helmet title="Profile">
      <CommonSection title="User Profile" />
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <h3 className="fw-bold mb-4">Profile</h3>
              {userData && (
                <div>
                  <p>
                    <strong>Name:</strong> {userData.username}
                  </p>
                  <p className="mb-5">
                    <strong>Email:</strong> {userData.email}
                  </p>
                  <div className="m-auto">
                    <h4 className="fw-bold mb-4">Interested Interior:</h4>
                    <p>
                      <strong>Category:</strong>{" "}
                      {userData.survey.category.join(", ")}
                    </p>
                    <p>
                      <strong>Color:</strong> {userData.survey.color.join(", ")}
                    </p>
                    <p>
                      <strong>Size:</strong> {userData.survey.size.join(", ")}
                    </p>
                    <p>
                      <strong>Model:</strong> {userData.survey.model.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Profile;
