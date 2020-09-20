import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export default function SavedRecipes({ open, toggle, savedRecipes, manageSavedRecipes }) {
  return <>
    <Modal isOpen={open} toggle={toggle} size="lg" scrollable={true}>
      <ModalHeader>Saved Recipes</ModalHeader>
      <ModalBody>
        {savedRecipes.length > 0 ? savedRecipes.map((e, i) =>
          <div key={i} className="mb-2">
            <a href={e.url} className="mr-2">
              <Button className="recipe-title-button">
                {e.title}
              </Button>
            </a>
            <Button>
              <FontAwesomeIcon icon={faMinus} onClick={() => manageSavedRecipes(e.id)} />
            </Button>
          </div>
        ) : (
            <div className="text-center">No saved recipes</div>
          )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
          </Button>
      </ModalFooter>
    </Modal>
  </>
}