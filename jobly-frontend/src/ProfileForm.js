import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Form";
import Alert from "./Alert";
import UserContext from "./UserContext";
import MySpinner from "./Spinner";

/**
 * ProfileForm:
 *
 * Props: editProfile - function, to be called in parent
 *
 * State: formData - like {
    username: "",
    first: "",
    last: "",
    email: "",
  }
          errors - array of Errors
 *
 * App -> Routes -> ProfileForm
 */
function ProfileForm({ editProfile }) {
  console.log("ProfileForm");

  const navigate = useNavigate();

  const { currUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (currUser) {
      setFormData({
        username: currUser.username,
        firstName: currUser.firstName,
        lastName: currUser.lastName,
        email: currUser.email,
      });
    }
  }, [currUser]);

  /**Handles the input change. */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  /**Handle form submission. */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // make axios call
      const copy = { ...formData };
      delete copy["username"];
      await editProfile(currUser.username, copy);
      navigate("/");
      // reroute to main page
    } catch (err) {
      // set errors
      setErrors((prevErrors) => [...prevErrors, err]);
    }
  }

  if (!currUser) {
    return <MySpinner />;
  }

  return (
    <Form className="ProfileForm container" onSubmit={handleSubmit}>
      <Form.Text as="h1">Sign Up</Form.Text>
      <Form.Group>
        <Form.Label>Username:</Form.Label>
        <Form.Control value={formData.username} name="username" disabled />
      </Form.Group>

      <Form.Group>
        <Form.Label>First Name:</Form.Label>
        <Form.Control
          value={formData.firstName}
          name="firstName"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Last Name:</Form.Label>
        <Form.Control
          value={formData.lastName}
          name="lastName"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          value={formData.email}
          type="email"
          name="email"
          onChange={handleChange}
          required
        />
      </Form.Group>
      {errors.length > 0 && <Alert errors={errors} />}
      <Button as="button" className="btn btn-primary">
        Submit
      </Button>
    </Form>
  );
}

export default ProfileForm;
