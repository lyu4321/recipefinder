import React, { useState } from "react";
import { Row, Col, Input, Button, Card, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faBorderStar } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Pagination from "./Components/Pagination";
import SavedRecipes from "./Components/SavedRecipes";
import egg from "./images/egg.svg";
import soup from "./images/soup.svg";
import chicken from "./images/chicken.svg";
import "./App.scss";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formFields, setFormFields] = useState([""]);
  const [recipes, setRecipes] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState(
    JSON.parse(localStorage.getItem("savedRecipes")) || []
  );
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false);
  const api_key = process.env.REACT_APP_API_KEY;

  const handleChange = (e, i) => {
    let newArray = [...formFields];
    newArray[i] = e.target.value;
    setFormFields(newArray);
  };

  const appendFormField = () => {
    if (formFields.length < 5) {
      const newFormField = "";
      setFormFields([...formFields, newFormField]);
    }
  };

  const handleSubmit = () => {
    let ingredients = formFields.join(",+");
    setLoading(true);
    setError(null);
    setCurrentRecipes([]);
    fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${api_key}&number=100`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setRecipes(data);
          setCurrentRecipes(data.slice(0, 10));
        } else {
          setError(
            data.code
              ? "Unable to fetch recipes at this time"
              : "No recipes found"
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRecipe = (id) => {
    fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        window.location.href = data.sourceUrl;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const manageSavedRecipes = (id) => {
    let savedItems = [...savedRecipes];
    let index = savedItems.findIndex((x) => x.id === id);
    if (index === -1) {
      fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            savedItems.push({
              id: data.id,
              title: data.title,
              url: data.sourceUrl,
            });
            setSavedRecipes(savedItems);
            localStorage.setItem("savedRecipes", JSON.stringify(savedItems));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      savedItems.splice(index, 1);
      setSavedRecipes(savedItems);
      localStorage.setItem("savedRecipes", JSON.stringify(savedItems));
    }
  };

  const jumpToPage = (e) => {
    const paginationArray = Array.from(
      Array(10),
      (x, index) => (index + 1) * 9 + index
    );
    setActive(e)
    setCurrentRecipes(
      recipes.slice(paginationArray[e] - 9, paginationArray[e] + 1)
    );
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const Icon = ({ id }) => {
    return <FontAwesomeIcon
      icon={(savedRecipes.findIndex((x) => x.id === id) !== -1) ? faStar : faBorderStar}
      className="cursor-pointer text-primary"
      size="lg"
      onClick={() => manageSavedRecipes(id)}
    />
  }

  const hour = new Date().getHours();
  const title =
    hour >= 0 && hour < 11
      ? "Breakfast?"
      : hour >= 11 && hour < 17
        ? "Lunch?"
        : "Dinner?";
  const logo =
    hour >= 0 && hour < 11 ? egg : hour >= 11 && hour < 17 ? soup : chicken;

  return (
    <>
      <Row style={{ minHeight: "100vh", maxWidth: "100%" }} className="m-0 p-0">
        <Col className="p-0 text-center col-md-5 col-12 header body-left">
          <div>
            <div className="title">What's for {title}</div>
            <div style={{ marginTop: "3rem" }}>
              <img src={logo} alt="" style={{ maxWidth: "50%" }} />
            </div>
          </div>
        </Col>
        <Col className="p-0 col-md-7 col-12">
          <div className="text-center title body">
            {formFields.map((e, i) => (
              <div key={i}>
                <Input
                  placeholder="Enter an ingredient"
                  onChange={(e) => handleChange(e, i)}
                  style={{ width: "40%" }}
                  className="mr-2 mt-4 d-inline"
                />
                <Button
                  onClick={appendFormField}
                  style={{ visibility: i < 4 ? "visible" : "hidden" }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            ))}
            <div className="mt-4">
              <Button type="submit" className="mr-2" onClick={handleSubmit}>
                Find recipes
              </Button>
              <Button onClick={() => setOpen(!open)}>View saved recipes</Button>
            </div>
            <Row
              style={{
                marginTop: "4rem",
                maxWidth: "100%",
                position: "relative",
              }}
              className="ml-0 mr-0 mb-1 p-0 justify-content-center grid-contaier"
            >
              {loading && <Spinner color="primary" />}
              {error && <>{error}</>}
              {currentRecipes.length > 0 &&
                currentRecipes.map((e, i) => (
                  <Card key={i} className="recipe-card m-2">
                    <Row className="m-1" style={{ fontWeight: 700 }}>
                      <Col
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                        className="text-left col-left"
                        md={10}
                      >
                        {e.title}
                      </Col>
                      <Col className="text-right col-right" md={2}>
                        <Icon id={e.id} />
                      </Col>
                    </Row>
                    <Row className="mt-4 p-0">
                      <Col className="ml-3 mr-3">
                        <img src={e.image} alt="" style={{ maxWidth: "80%" }} />
                      </Col>
                    </Row>
                    <Row className="mt-4 p-0">
                      <Col className="m-0 p-0">
                        <Button
                          className="mb-4 button"
                          onClick={() => getRecipe(e.id)}
                          style={{ maxWidth: "50%" }}
                        >
                          Go to recipe
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
            </Row>
            {currentRecipes.length > 0 && (
              <Row
                className="flex justify-content-center m-0 mt-2"
                style={{ maxWidth: "100%" }}
              >
                <Pagination jumpToPage={jumpToPage} active={active} setActive={setActive} />
              </Row>
            )}
          </div>
          <div
            style={{
              position: "relative",
              bottom: "1rem",
              maxWidth: "100%",
              fontSize: "18px",
            }}
            className="mt-4 text-center footer"
          >
            <div className="mb-2">
              <a href="https://github.com/lyu4321">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
            </div>
            <div className="mb-2">
              API provided by <a href="https://spoonacular.com/">Spoonacular</a>
            </div>
            <div>
              Icons provided by{" "}
              <a
                href="https://www.flaticon.com/authors/dinosoftlabs"
                title="DinosoftLabs"
              >
                DinosoftLabs
              </a>{" "}
              from{" "}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </div>
          </div>
        </Col>
      </Row>
      <SavedRecipes
        open={open}
        toggle={() => setOpen(!open)}
        savedRecipes={savedRecipes}
        manageSavedRecipes={manageSavedRecipes}
      />
    </>
  );
}

export default App;
