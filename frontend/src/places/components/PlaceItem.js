import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import Map from "../../shared/components/UIElements/Map";
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const openConfirmDelete = () => {
    setShowConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (authCtx.userId && authCtx.userId === props.creatorId) {
      try {
        await sendRequest(
          `http://localhost:5000/api/places/${props.id}`,
          "DELETE"
        );
        props.onDelete(props.id);
        setShowConfirmDelete(false);
      } catch (error) {}
    }

    console.log("Deleting...");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-footer"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.location} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmDelete}
        onCancel={closeConfirmDelete}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={closeConfirmDelete}>
              CANCEL
            </Button>
            <Button danger onClick={handleConfirmDelete}>
              CONFIRM
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? This cannot be undone.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <figure className="place-item__image">
            <img src={props.image} alt={props.title} />
          </figure>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {authCtx.userId === props.creatorId && (
              <>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={openConfirmDelete}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
