import React, { useState } from "react";
import { Row, Col, Card, Alert, Spinner, Input, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faStar, faSearch, faList } from "@fortawesome/free-solid-svg-icons";
import { faStar as faBorderStar } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Pagination from "./Components/Pagination";
import SavedRecipes from "./Components/SavedRecipes";
import "./App.scss";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formFields, setFormFields] = useState([""]);
  const [recipes, setRecipes] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState(JSON.parse(localStorage.getItem("savedRecipes")) || []);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const api_key = process.env.REACT_APP_API_KEY;

  const toggle = () => {
    setOpen(!open);
  }

  const handleChange = (e, i) => {
    let newArray = [...formFields];
    newArray[i] = e.target.value;
    setFormFields(newArray);
  };

  const appendFormField = () => {
    formFields.length < 5 && setFormFields([...formFields, ""]);
  };

  const handleSubmit = () => {
    const ingredients = formFields.join(",+");
    setLoading(true);
    setError(null);
    setCurrentRecipes([]);
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${api_key}&number=100`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setRecipes(data);
          setCurrentRecipes(data.slice(0, 20));
          document.querySelector(".title").style.marginTop = "5rem";
        } else {
          setError(data.code ? "Unable to fetch recipes at this time" : "No recipes found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRecipe = (id) => {
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`)
      .then((response) => response.json())
      .then((data) => window.location.href = data.sourceUrl)
      .catch((err) => {
        console.log(err);
      });
  };

  const manageSavedRecipes = (id) => {
    const savedItems = [...savedRecipes];
    const index = savedItems.findIndex((x) => x.id === id);
    if (index === -1) {
      fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setSavedRecipes(prevState => [...prevState, { id: data.id, title: data.title, url: data.sourceUrl }]);
            localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
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
    const paginationArray = Array.from(Array(5), (x, index) => (index + 1) * 19 + index);
    setActive(e);
    setCurrentRecipes(recipes.slice(paginationArray[e] - 19, paginationArray[e] + 1));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const Icon = ({ id }) => {
    return <FontAwesomeIcon
      icon={savedRecipes.findIndex((x) => x.id === id) !== -1 ? faStar : faBorderStar}
      className="cursor-pointer icon"
      size="lg"
      onClick={() => manageSavedRecipes(id)} />
  };

  return <>
    <Row className="main-container m-0">
      <div className="background w-100 text-center">
        <div className="title">
          {formFields.map((e, i) => (
            <div key={i}>
              <Input placeholder="Enter an ingredient"
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                className="mr-2 d-inline" />
              <Button onClick={appendFormField} style={{ visibility: i < 4 ? "visible" : "hidden" }}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          ))}
          <div className="buttons-container ml-1 mr-1">
            <Button type="submit" className="submit-button mr-2" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faSearch} /> Find recipes
            </Button>
            <Button onClick={() => setOpen(!open)} className="view-button">
              <FontAwesomeIcon icon={faList} /> View saved recipes
            </Button>
          </div>
          <Row className="recipe-container ml-0 mr-0 grid-container justify-content-center">
            {loading && <Spinner className="spinner" />}
            {error && <Alert color="primary">{error}</Alert>}
            {currentRecipes.length > 0 && currentRecipes.map((e, i) =>
              <Card key={i} className="recipe-card ml-2 mr-2 mb-4">
                <Row className="ml-2 mr-2 mt-2">
                  <div className="recipe-title d-inline-block">
                    {e.title}
                  </div>
                  <span className="recipe-save">
                    <Icon id={e.id} />
                  </span>
                </Row>
                <Row className="mt-4">
                  <Col className="m-auto">
                    <img src={e.image} alt="" className="recipe-image" />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Button className="get-recipe mb-4" onClick={() => getRecipe(e.id)}>
                      Go to recipe
                      </Button>
                  </Col>
                </Row>
              </Card>
            )}
          </Row>
          {currentRecipes.length > 0 &&
            <Row className="pagination-container flex justify-content-center m-auto">
              <Pagination jumpToPage={jumpToPage} active={active} />
            </Row>
          }
        </div>
        <div className="footer">
          <div className="mb-2">
            <a href="https://github.com/lyu4321"><FontAwesomeIcon icon={faGithub} size="lg" /></a>
          </div>
          <div className="mb-2">
            API provided by <a href="https://spoonacular.com/">Spoonacular</a>
          </div>
        </div>
      </div>
    </Row>
    <SavedRecipes open={open} toggle={toggle} savedRecipes={savedRecipes} manageSavedRecipes={manageSavedRecipes} />
  </>
}

export default App;
